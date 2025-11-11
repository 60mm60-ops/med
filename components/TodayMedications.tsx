'use client';

import React from 'react';
import { Medication, MedicationLog, MedicationTiming } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { addMedicationLog, generateId, updateMedication } from '@/lib/storage';
import { format } from 'date-fns';

interface TodayMedicationsProps {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onRefresh: () => void;
  onMedicationClick: (medication: Medication) => void;
}

const timingConfig = {
  morning: { label: '朝', emoji: '☀️', time: '8:00' },
  noon: { label: '昼', emoji: '🌤', time: '12:00' },
  night: { label: '夜', emoji: '🌙', time: '20:00' },
};

export const TodayMedications: React.FC<TodayMedicationsProps> = ({
  medications,
  medicationLogs,
  onRefresh,
  onMedicationClick,
}) => {
  // 今日の日付（YYYY-MM-DD形式）
  const today = format(new Date(), 'yyyy-MM-dd');

  // 特定の薬が今日のその時間帯に飲まれたかチェック
  const isTakenToday = (medicationId: string, timing: MedicationTiming): MedicationLog | undefined => {
    return medicationLogs.find(log => {
      const logDate = format(new Date(log.takenAt), 'yyyy-MM-dd');
      return log.medicationId === medicationId && log.timing === timing && logDate === today;
    });
  };

  // 薬を飲んだ時の処理
  const handleTakeMedication = (medication: Medication, timing: MedicationTiming) => {
    // 服薬記録を追加
    const log: MedicationLog = {
      id: generateId(),
      medicationId: medication.id,
      takenAt: new Date().toISOString(),
      timing,
    };
    addMedicationLog(log);

    // 残薬を減らす
    const newRemainingCount = Math.max(0, medication.remainingCount - 1);
    updateMedication(medication.id, { remainingCount: newRemainingCount });

    onRefresh();
  };

  // 時間帯ごとに薬をグループ化
  const renderTimingSection = (timing: MedicationTiming) => {
    const config = timingConfig[timing];
    const medsForTiming = medications.filter(med => med.timing.includes(timing));

    if (medsForTiming.length === 0) return null;

    return (
      <div key={timing} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-3xl">{config.emoji}</span>
          <span>{config.label} {config.time}</span>
        </h2>
        
        <div className="space-y-4">
          {medsForTiming.map(medication => {
            const log = isTakenToday(medication.id, timing);
            const isTaken = !!log;

            return (
              <Card key={`${medication.id}-${timing}`} className="relative">
                {isTaken && (
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✓ 飲みました
                  </div>
                )}
                
                <div 
                  className="cursor-pointer"
                  onClick={() => onMedicationClick(medication)}
                >
                  <div className="flex gap-4 mb-4">
                    {medication.photoUrl ? (
                      <img
                        src={medication.photoUrl}
                        alt={medication.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                        💊
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {medication.name}
                      </h3>
                      <p className="text-lg text-gray-600 mb-1">
                        {medication.dosage}
                      </p>
                      <p className="text-lg text-gray-600 mb-2">
                        {medication.frequency}
                      </p>
                      <p className={`text-lg font-semibold ${
                        medication.remainingCount <= 5 ? 'text-red-600' : 'text-primary-600'
                      }`}>
                        残り {medication.remainingCount} 錠
                      </p>
                    </div>
                  </div>
                </div>

                {isTaken ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-base text-gray-600">
                      飲んだ時刻: {format(new Date(log.takenAt), 'HH:mm')}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={() => handleTakeMedication(medication, timing)}
                      className="w-full"
                    >
                      飲んだ
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 mb-4">まだ薬が登録されていません</p>
        <p className="text-lg text-gray-400">「+ 薬を追加」ボタンから薬を登録してください</p>
      </div>
    );
  }

  return (
    <div>
      {(['morning', 'noon', 'night'] as MedicationTiming[]).map(renderTimingSection)}
    </div>
  );
};
