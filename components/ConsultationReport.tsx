'use client';

import React from 'react';
import { Medication, MedicationLog, SideEffectLog } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { format, differenceInDays } from 'date-fns';

interface ConsultationReportProps {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  sideEffectLogs: SideEffectLog[];
}

export const ConsultationReport: React.FC<ConsultationReportProps> = ({
  medications,
  medicationLogs,
  sideEffectLogs,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // 最古の処方日を前回の診察日とする
  const oldestPrescribedDate = medications.length > 0
    ? new Date(Math.min(...medications.map(m => new Date(m.prescribedDate).getTime())))
    : new Date();

  const daysSinceLastConsultation = differenceInDays(new Date(), oldestPrescribedDate);

  // 薬ごとの服薬状況を計算
  const getMedicationStats = (medication: Medication) => {
    const logs = medicationLogs.filter(log => log.medicationId === medication.id);
    const expectedDoses = medication.timing.length * daysSinceLastConsultation;
    const actualDoses = logs.length;
    const missedDoses = Math.max(0, expectedDoses - actualDoses);
    const adherenceRate = expectedDoses > 0 ? Math.round((actualDoses / expectedDoses) * 100) : 100;

    return {
      expectedDoses,
      actualDoses,
      missedDoses,
      adherenceRate,
    };
  };

  // 副作用をソート
  const sortedSideEffects = [...sideEffectLogs].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 mb-4">まだ薬が登録されていません</p>
        <p className="text-lg text-gray-400">薬を登録すると診察レポートが作成されます</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 print:hidden">
        <Button variant="primary" onClick={handlePrint}>
          📄 印刷する
        </Button>
      </div>

      <div className="space-y-6">
        {/* 診察予定 */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 診察レポート</h2>
          <p className="text-lg text-gray-700">
            作成日: {format(new Date(), 'yyyy年MM月dd日')}
          </p>
        </Card>

        {/* 経過日数 */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-3">📊 前回診察からの経過</h3>
          <p className="text-3xl font-bold text-primary-600">
            {daysSinceLastConsultation} 日
          </p>
          <p className="text-base text-gray-600 mt-2">
            前回処方日: {format(oldestPrescribedDate, 'yyyy年MM月dd日')}
          </p>
        </Card>

        {/* 服薬状況 */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">💊 服薬状況</h3>
          <div className="space-y-4">
            {medications.map(medication => {
              const stats = getMedicationStats(medication);
              return (
                <div key={medication.id} className="border-l-4 border-primary-400 pl-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {medication.name}
                  </h4>
                  <div className="space-y-1 text-base text-gray-700">
                    <p>
                      <strong>服薬率:</strong>{' '}
                      <span className={`font-bold ${
                        stats.adherenceRate >= 90 ? 'text-primary-600' :
                        stats.adherenceRate >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stats.adherenceRate}%
                      </span>
                    </p>
                    <p>
                      <strong>実際の服薬:</strong> {stats.actualDoses}回 / 予定 {stats.expectedDoses}回
                    </p>
                    {stats.missedDoses > 0 && (
                      <p className="text-red-600">
                        <strong>飲み忘れ:</strong> {stats.missedDoses}回
                      </p>
                    )}
                    <p>
                      <strong>残薬:</strong>{' '}
                      <span className={medication.remainingCount <= 5 ? 'text-red-600 font-bold' : ''}>
                        {medication.remainingCount}錠
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 副作用・症状 */}
        {sortedSideEffects.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ 副作用・気になる症状</h3>
            <div className="space-y-3">
              {sortedSideEffects.map(log => {
                const medication = medications.find(m => m.id === log.medicationId);
                return (
                  <div key={log.id} className="border-l-4 border-red-400 pl-4 py-2">
                    <p className="text-sm text-gray-500">
                      {format(new Date(log.recordedAt), 'yyyy/MM/dd HH:mm')}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {log.symptom}
                    </p>
                    {medication && (
                      <p className="text-base text-gray-600">
                        関連する薬: {medication.name}
                      </p>
                    )}
                    {log.note && (
                      <p className="text-base text-gray-600 mt-1">{log.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 自由記入メモ */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">📝 医師に伝えたいこと</h3>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[150px] border-2 border-gray-200">
            <p className="text-base text-gray-500 italic">
              ※ 診察時に気になることがあれば、ここにメモしておきましょう
            </p>
          </div>
        </Card>

        {/* サマリー */}
        <Card className="bg-primary-50 border-2 border-primary-200">
          <h3 className="text-xl font-bold text-primary-800 mb-4">✨ サマリー</h3>
          <div className="space-y-2 text-base text-gray-700">
            <p>• 前回診察から <strong>{daysSinceLastConsultation}日</strong> 経過</p>
            <p>
              • 平均服薬率:{' '}
              <strong>
                {Math.round(
                  medications.reduce((sum, med) => sum + getMedicationStats(med).adherenceRate, 0) /
                  medications.length
                )}%
              </strong>
            </p>
            <p>
              • 副作用・症状の記録: <strong>{sortedSideEffects.length}件</strong>
            </p>
            <p>
              • 残薬が少ない薬:{' '}
              <strong>
                {medications.filter(m => m.remainingCount <= 5).length}件
              </strong>
            </p>
          </div>
        </Card>
      </div>

      {/* 印刷用のスタイル */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
};
