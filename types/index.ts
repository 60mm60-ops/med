// 服薬タイミング
export type MedicationTiming = 'morning' | 'noon' | 'night';

// 薬（Medication）
export interface Medication {
  id: string;
  name: string; // 薬名
  dosage: string; // 用量（例: "60mg"）
  timing: MedicationTiming[]; // いつ飲むか
  frequency: string; // 用法（例: "1回1錠"）
  totalCount: number; // 処方された総数
  remainingCount: number; // 残数
  photoUrl?: string; // 薬の写真
  prescribedDate: string; // 処方日（ISO形式）
  hospital: string; // 処方元
  sideEffects?: string[]; // 主な副作用リスト
  createdAt: string; // 作成日時
}

// 服薬記録（MedicationLog）
export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: string; // 飲んだ日時（ISO形式）
  timing: MedicationTiming;
}

// 副作用の重症度
export type SideEffectSeverity = 'mild' | 'moderate' | 'severe';

// 副作用記録（SideEffectLog）
export interface SideEffectLog {
  id: string;
  medicationId: string;
  symptom: string; // 症状
  severity?: SideEffectSeverity; // 重症度
  note?: string; // メモ
  recordedAt: string; // 記録日時（ISO形式）
}

// アプリケーション全体のデータ
export interface AppData {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  sideEffectLogs: SideEffectLog[];
}
