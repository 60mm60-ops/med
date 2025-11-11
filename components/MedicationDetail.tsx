'use client';

import React, { useState } from 'react';
import { Medication, SideEffectLog } from '@/types';
import { Button } from './Button';
import { Card } from './Card';
import { addSideEffectLog, deleteMedication, generateId } from '@/lib/storage';
import { format } from 'date-fns';

interface MedicationDetailProps {
  medication: Medication;
  sideEffectLogs: SideEffectLog[];
  onClose: () => void;
  onRefresh: () => void;
}

const commonSideEffects = [
  '胃の痛み',
  '吐き気',
  '眠気',
  'めまい',
  '頭痛',
  '下痢',
  '便秘',
  '発疹',
];

export const MedicationDetail: React.FC<MedicationDetailProps> = ({
  medication,
  sideEffectLogs,
  onClose,
  onRefresh,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [note, setNote] = useState('');

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSaveSideEffects = () => {
    const symptomsToSave = [...selectedSymptoms];
    if (customSymptom.trim()) {
      symptomsToSave.push(customSymptom.trim());
    }

    if (symptomsToSave.length === 0 && !note.trim()) {
      alert('症状またはメモを入力してください');
      return;
    }

    symptomsToSave.forEach(symptom => {
      const log: SideEffectLog = {
        id: generateId(),
        medicationId: medication.id,
        symptom,
        note: note.trim() || undefined,
        recordedAt: new Date().toISOString(),
      };
      addSideEffectLog(log);
    });

    setSelectedSymptoms([]);
    setCustomSymptom('');
    setNote('');
    onRefresh();
    alert('副作用を記録しました');
  };

  const handleDeleteMedication = () => {
    if (confirm(`「${medication.name}」を削除してもよろしいですか？\n\n関連する服薬記録と副作用記録も削除されます。`)) {
      deleteMedication(medication.id);
      onRefresh();
      onClose();
    }
  };

  const medicationSideEffectLogs = sideEffectLogs.filter(
    log => log.medicationId === medication.id
  ).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
      <Card>
        <div className="flex gap-4 mb-4">
          {medication.photoUrl ? (
            <img
              src={medication.photoUrl}
              alt={medication.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-5xl">
              💊
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {medication.name}
            </h2>
            <p className="text-lg text-gray-600 mb-1">{medication.dosage}</p>
            <p className="text-lg text-gray-600">{medication.frequency}</p>
          </div>
        </div>

        <div className="space-y-2 text-base text-gray-700">
          <p><strong>飲むタイミング:</strong> {medication.timing.map(t => {
            const config = { morning: '朝', noon: '昼', night: '夜' };
            return config[t];
          }).join(', ')}</p>
          <p><strong>残り:</strong> <span className={medication.remainingCount <= 5 ? 'text-red-600 font-bold' : 'text-primary-600 font-bold'}>{medication.remainingCount} 錠</span> / {medication.totalCount} 錠</p>
          <p><strong>処方元:</strong> {medication.hospital}</p>
          <p><strong>処方日:</strong> {format(new Date(medication.prescribedDate), 'yyyy年MM月dd日')}</p>
        </div>
      </Card>

      {/* 副作用チェック */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ 副作用チェック</h3>
        <p className="text-base text-gray-600 mb-4">今、こんな症状はありませんか？</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {commonSideEffects.map(symptom => (
            <button
              key={symptom}
              type="button"
              onClick={() => handleSymptomToggle(symptom)}
              className={`px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-base font-semibold mb-2">その他の症状</label>
          <input
            type="text"
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            placeholder="他にも気になる症状があれば入力してください"
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-semibold mb-2">メモ</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="症状の詳細や気になることを記入してください"
            rows={3}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        <Button variant="primary" onClick={handleSaveSideEffects} className="w-full">
          副作用を記録
        </Button>
      </Card>

      {/* 副作用記録 */}
      {medicationSideEffectLogs.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">📝 副作用記録</h3>
          <div className="space-y-3">
            {medicationSideEffectLogs.map(log => (
              <div key={log.id} className="border-l-4 border-red-400 pl-4 py-2">
                <p className="text-sm text-gray-500">
                  {format(new Date(log.recordedAt), 'yyyy/MM/dd HH:mm')}
                </p>
                <p className="text-lg font-semibold text-gray-800">{log.symptom}</p>
                {log.note && (
                  <p className="text-base text-gray-600 mt-1">{log.note}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* アクションボタン */}
      <div className="flex gap-4">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          閉じる
        </Button>
        <Button variant="danger" onClick={handleDeleteMedication} className="flex-1">
          この薬を削除
        </Button>
      </div>
    </div>
  );
};
