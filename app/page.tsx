'use client';

import React, { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { MedicationForm } from '@/components/MedicationForm';
import { TodayMedications } from '@/components/TodayMedications';
import { MedicationNotebook } from '@/components/MedicationNotebook';
import { ConsultationReport } from '@/components/ConsultationReport';
import { MedicationDetail } from '@/components/MedicationDetail';
import { Medication } from '@/types';

type TabType = 'today' | 'notebook' | 'report';

export default function Home() {
  const { data, refreshData, isLoading } = useAppData();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refreshData();
  };

  const handleMedicationClick = (medication: Medication) => {
    setSelectedMedication(medication);
  };

  const handleDetailClose = () => {
    setSelectedMedication(null);
    refreshData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center">ぽちぽちメッズ</h1>
          <p className="text-center text-sm mt-1 opacity-90">服薬管理アプリ</p>
        </div>
      </header>

      {/* タブナビゲーション */}
      <nav className="bg-white shadow-md sticky top-[73px] z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === 'today'
                  ? 'text-primary-600 border-b-4 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              今日の薬
            </button>
            <button
              onClick={() => setActiveTab('notebook')}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === 'notebook'
                  ? 'text-primary-600 border-b-4 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              おくすり手帳
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === 'report'
                  ? 'text-primary-600 border-b-4 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              診察レポート
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'today' && (
          <TodayMedications
            medications={data.medications}
            medicationLogs={data.medicationLogs}
            onRefresh={refreshData}
            onMedicationClick={handleMedicationClick}
          />
        )}
        {activeTab === 'notebook' && (
          <MedicationNotebook medications={data.medications} />
        )}
        {activeTab === 'report' && (
          <ConsultationReport
            medications={data.medications}
            medicationLogs={data.medicationLogs}
            sideEffectLogs={data.sideEffectLogs}
          />
        )}
      </main>

      {/* フローティング追加ボタン */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-4xl font-bold transition-all duration-200 active:scale-95"
          aria-label="薬を追加"
        >
          +
        </button>
      </div>

      {/* 薬追加モーダル */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="薬を追加"
      >
        <MedicationForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* 薬詳細モーダル */}
      {selectedMedication && (
        <Modal
          isOpen={!!selectedMedication}
          onClose={handleDetailClose}
          title={selectedMedication.name}
        >
          <MedicationDetail
            medication={selectedMedication}
            sideEffectLogs={data.sideEffectLogs}
            onClose={handleDetailClose}
            onRefresh={refreshData}
          />
        </Modal>
      )}
    </div>
  );
}
