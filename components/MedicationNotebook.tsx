'use client';

import React from 'react';
import { Medication } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { format } from 'date-fns';

interface MedicationNotebookProps {
  medications: Medication[];
}

export const MedicationNotebook: React.FC<MedicationNotebookProps> = ({ medications }) => {
  const handlePrint = () => {
    window.print();
  };

  // 処方日でグループ化
  const groupedMedications = medications.reduce((groups, med) => {
    const date = format(new Date(med.prescribedDate), 'yyyy年MM月dd日');
    const key = `${date}_${med.hospital}`;
    
    if (!groups[key]) {
      groups[key] = {
        date: med.prescribedDate,
        hospital: med.hospital,
        medications: [],
      };
    }
    
    groups[key].medications.push(med);
    return groups;
  }, {} as Record<string, { date: string; hospital: string; medications: Medication[] }>);

  // 日付順にソート
  const sortedGroups = Object.values(groupedMedications).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      <div className="mb-6 print:hidden">
        <Button variant="primary" onClick={handlePrint}>
          📄 印刷する
        </Button>
      </div>

      <div className="space-y-6">
        {sortedGroups.map((group, index) => (
          <Card key={index}>
            <div className="border-b-2 border-primary-600 pb-3 mb-4">
              <p className="text-lg text-gray-600">
                {format(new Date(group.date), 'yyyy年MM月dd日')}
              </p>
              <h3 className="text-xl font-bold text-gray-800">
                {group.hospital}
              </h3>
            </div>

            <div className="space-y-4">
              {group.medications.map(med => (
                <div key={med.id} className="border-l-4 border-primary-400 pl-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {med.name}
                  </h4>
                  
                  <div className="space-y-1 text-base text-gray-700">
                    <p><strong>用量:</strong> {med.dosage}</p>
                    <p><strong>用法:</strong> {med.frequency}</p>
                    <p>
                      <strong>服用タイミング:</strong>{' '}
                      {med.timing.map(t => {
                        const config = { morning: '朝', noon: '昼', night: '夜' };
                        return config[t];
                      }).join('・')}
                    </p>
                    <p><strong>処方数:</strong> {med.totalCount}錠（{Math.ceil(med.totalCount / med.timing.length)}日分）</p>
                  </div>

                  {med.photoUrl && (
                    <div className="mt-3">
                      <img
                        src={med.photoUrl}
                        alt={med.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
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
