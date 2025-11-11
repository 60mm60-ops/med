'use client';

import React, { useState } from 'react';
import { Medication, MedicationTiming } from '@/types';
import { addMedication, generateId } from '@/lib/storage';
import { Button } from './Button';

interface MedicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [hospital, setHospital] = useState('');
  const [timing, setTiming] = useState<MedicationTiming[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTimingToggle = (time: MedicationTiming) => {
    if (timing.includes(time)) {
      setTiming(timing.filter(t => t !== time));
    } else {
      setTiming([...timing, time]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !dosage || !frequency || !totalCount || !hospital || timing.length === 0) {
      alert('すべての必須項目を入力してください');
      return;
    }

    const medication: Medication = {
      id: generateId(),
      name,
      dosage,
      frequency,
      totalCount: parseInt(totalCount),
      remainingCount: parseInt(totalCount),
      hospital,
      timing,
      photoUrl,
      prescribedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sideEffects: [],
    };

    addMedication(medication);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 薬の写真 */}
      <div>
        <label className="block text-lg font-semibold mb-2">薬の写真（任意）</label>
        {photoUrl && (
          <div className="mb-4">
            <img src={photoUrl} alt="薬の写真" className="w-full max-w-xs rounded-lg" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={isUploading}
          className="block w-full text-base text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>

      {/* 薬の名前 */}
      <div>
        <label className="block text-lg font-semibold mb-2">薬の名前 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: ロキソニン錠"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          required
        />
      </div>

      {/* 用量 */}
      <div>
        <label className="block text-lg font-semibold mb-2">用量 *</label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="例: 60mg"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          required
        />
      </div>

      {/* 用法 */}
      <div>
        <label className="block text-lg font-semibold mb-2">用法 *</label>
        <input
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="例: 1回1錠"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          required
        />
      </div>

      {/* いつ飲むか */}
      <div>
        <label className="block text-lg font-semibold mb-2">いつ飲みますか？ *</label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'morning' as MedicationTiming, label: '朝 ☀️', time: '8:00' },
            { value: 'noon' as MedicationTiming, label: '昼 🌤', time: '12:00' },
            { value: 'night' as MedicationTiming, label: '夜 🌙', time: '20:00' },
          ].map(({ value, label, time }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleTimingToggle(value)}
              className={`px-6 py-3 text-lg font-semibold rounded-xl transition-colors ${
                timing.includes(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label} {time}
            </button>
          ))}
        </div>
      </div>

      {/* 処方数 */}
      <div>
        <label className="block text-lg font-semibold mb-2">処方数 *</label>
        <input
          type="number"
          value={totalCount}
          onChange={(e) => setTotalCount(e.target.value)}
          placeholder="例: 30"
          min="1"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          required
        />
      </div>

      {/* 処方元 */}
      <div>
        <label className="block text-lg font-semibold mb-2">処方元（病院・薬局） *</label>
        <input
          type="text"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          placeholder="例: 〇〇病院 内科"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          required
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          登録する
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
      </div>
    </form>
  );
};
