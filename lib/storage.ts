import { AppData, Medication, MedicationLog, SideEffectLog } from '@/types';

const STORAGE_KEY = 'pochi-pochi-meds-data';

// 初期データ
const initialData: AppData = {
  medications: [],
  medicationLogs: [],
  sideEffectLogs: [],
};

// データを読み込む
export const loadData = (): AppData => {
  if (typeof window === 'undefined') return initialData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialData;
    return JSON.parse(stored);
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    return initialData;
  }
};

// データを保存する
export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('データの保存に失敗しました:', error);
  }
};

// 薬を追加
export const addMedication = (medication: Medication): void => {
  const data = loadData();
  data.medications.push(medication);
  saveData(data);
};

// 薬を更新
export const updateMedication = (id: string, updates: Partial<Medication>): void => {
  const data = loadData();
  const index = data.medications.findIndex(m => m.id === id);
  if (index !== -1) {
    data.medications[index] = { ...data.medications[index], ...updates };
    saveData(data);
  }
};

// 薬を削除
export const deleteMedication = (id: string): void => {
  const data = loadData();
  data.medications = data.medications.filter(m => m.id !== id);
  // 関連する記録も削除
  data.medicationLogs = data.medicationLogs.filter(log => log.medicationId !== id);
  data.sideEffectLogs = data.sideEffectLogs.filter(log => log.medicationId !== id);
  saveData(data);
};

// 服薬記録を追加
export const addMedicationLog = (log: MedicationLog): void => {
  const data = loadData();
  data.medicationLogs.push(log);
  saveData(data);
};

// 副作用記録を追加
export const addSideEffectLog = (log: SideEffectLog): void => {
  const data = loadData();
  data.sideEffectLogs.push(log);
  saveData(data);
};

// 副作用記録を削除
export const deleteSideEffectLog = (id: string): void => {
  const data = loadData();
  data.sideEffectLogs = data.sideEffectLogs.filter(log => log.id !== id);
  saveData(data);
};

// UUIDを生成
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
