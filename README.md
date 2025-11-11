# ぽちぽちメッズ（Pochi Pochi Meds）

服薬管理と診察サポートを行うWebアプリケーション。  
「弱い人に合わせる設計」をコンセプトに、高齢者や病気の人でも直感的に使えるシンプルなUIを実現しています。

![ぽちぽちメッズ](https://via.placeholder.com/800x400/22c55e/ffffff?text=ぽちぽちメッズ)

## 🌟 コンセプト

- **ターゲット**: 患者（特に高齢者、病気で頭が回らない人）
- **設計思想**: 「弱い人に合わせる設計」
- **ブランド**: ぽちぽちケアーズシリーズの一つ
- **特徴**: 既存のおくすり手帳アプリと違い、「おくすり手帳としても使える」二面性を持つ

## ✨ 主要機能（MVP版）

### 1. 服薬管理（今日の薬タブ）
- ✅ 薬の登録（写真撮影可能）
- ✅ 今日飲む薬の表示（朝☀️ / 昼🌤 / 夜🌙で整理）
- ✅ 大きな「飲んだ」ボタンで記録
- ✅ 飲んだ時刻を自動記録
- ✅ 残薬カウント（自動減算）
- ✅ 残薬が少ない場合の警告表示

### 2. 副作用管理
- ✅ 各薬の詳細画面で副作用チェック
- ✅ 主な副作用のチェックリスト（胃痛、吐き気、眠気など）
- ✅ 自由入力欄「今日の症状」
- ✅ 副作用記録のタイムライン表示

### 3. 診察レポート自動生成
- ✅ 前回診察からの経過日数
- ✅ 服薬状況（飲み忘れ回数、服薬率）
- ✅ 副作用・気になる症状の一覧（日付付き）
- ✅ 印刷機能

### 4. おくすり手帳タブ
- ✅ 正式なおくすり手帳形式での表示
- ✅ 薬剤名、用量、用法の記録
- ✅ 処方日、処方元医療機関の記録
- ✅ 印刷機能

## 🛠 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **date-fns** (日付処理)
- **LocalStorage** (データ保存)

## 📦 セットアップ

### 必要な環境
- Node.js 18.17以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/pochi-pochi-meds.git
cd pochi-pochi-meds

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーを起動
npm start
```

## 📱 使い方

### 1. 薬を登録する
1. 右下の「+」ボタンをクリック
2. 薬の情報を入力
   - 薬の写真（任意）
   - 薬の名前
   - 用量（例: 60mg）
   - 用法（例: 1回1錠）
   - 飲むタイミング（朝・昼・夜）
   - 処方数
   - 処方元
3. 「登録する」ボタンをクリック

### 2. 薬を飲む
1. 「今日の薬」タブで該当する薬を探す
2. 大きな「飲んだ」ボタンをクリック
3. 飲んだ時刻が自動記録され、残薬が減ります

### 3. 副作用を記録する
1. 薬のカードをクリックして詳細画面を開く
2. 「副作用チェック」セクションで該当する症状を選択
3. 必要に応じてメモを記入
4. 「副作用を記録」ボタンをクリック

### 4. 診察レポートを確認・印刷する
1. 「診察レポート」タブを開く
2. 服薬状況や副作用記録が自動でまとめられます
3. 「📄 印刷する」ボタンで印刷またはPDF保存

## 🎨 デザイン原則

1. **シンプル**: 余計な情報を排除、必要最小限
2. **大きく**: ボタン、文字、写真を大きく（最小48px × 48px）
3. **わかりやすい**: 専門用語を使わない
4. **優しい**: 温かみのあるグリーン系の色使い
5. **ぽちぽち**: ボタン1つで完結する設計

### カラーパレット
- Primary: グリーン系（#22c55e）
- 高齢者に優しいコントラスト
- 警告は赤系（残薬が少ないなど）

### 文字サイズ
- 通常テキスト: 16px以上
- ボタンテキスト: 18px以上
- 見出し: 24px以上

## 📂 プロジェクト構造

```
pochi-pochi-meds/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ
│   └── globals.css          # グローバルスタイル
├── components/               # Reactコンポーネント
│   ├── Button.tsx           # ボタンコンポーネント
│   ├── Card.tsx             # カードコンポーネント
│   ├── Modal.tsx            # モーダルコンポーネント
│   ├── MedicationForm.tsx   # 薬登録フォーム
│   ├── TodayMedications.tsx # 今日の薬表示
│   ├── MedicationDetail.tsx # 薬詳細・副作用記録
│   ├── MedicationNotebook.tsx # おくすり手帳
│   └── ConsultationReport.tsx # 診察レポート
├── hooks/                    # カスタムフック
│   └── useAppData.ts        # データ管理フック
├── lib/                      # ユーティリティ
│   └── storage.ts           # LocalStorage操作
├── types/                    # TypeScript型定義
│   └── index.ts             # 全型定義
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 📊 データ構造

### Medication（薬）
```typescript
{
  id: string;
  name: string;              // 薬名
  dosage: string;            // 用量
  timing: string[];          // 飲むタイミング
  frequency: string;         // 用法
  totalCount: number;        // 処方数
  remainingCount: number;    // 残数
  photoUrl?: string;         // 写真URL
  prescribedDate: string;    // 処方日
  hospital: string;          // 処方元
}
```

### MedicationLog（服薬記録）
```typescript
{
  id: string;
  medicationId: string;
  takenAt: string;           // 飲んだ日時
  timing: string;            // morning/noon/night
}
```

### SideEffectLog（副作用記録）
```typescript
{
  id: string;
  medicationId: string;
  symptom: string;           // 症状
  note?: string;             // メモ
  recordedAt: string;        // 記録日時
}
```

## 🚀 将来実装予定の機能

- 📸 OCR + AI認識（写真から薬情報を自動入力）
- 🤖 AI副作用検索（「頭が痛い」→「この薬の副作用の可能性あり」）
- 👨‍👩‍👧‍👦 家族共有機能（遠隔確認）
- ⏰ アラート機能（服薬時間のリマインダー）
- 📱 QRコード表示（薬局や病院で読み取り）

## 🎯 競合との差別化ポイント

既存のおくすり手帳アプリは：
- 複雑すぎる（機能が多い）
- 高齢者に優しくない
- 薬局依存（QRコード前提）
- 副作用管理が弱い
- 診察サポートがない

**ぽちぽちメッズは：**
- ✨ 超シンプル
- 👵 「弱い人に合わせる設計」
- 📷 写真でOCR（将来）
- ⚠️ 副作用の検索・記録
- 📋 診察レポート自動生成
- 📖 「おくすり手帳としても使える」二面性

## 📝 ライセンス

MIT License

## 👥 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📞 お問い合わせ

質問や提案がある場合は、GitHubのissueを開いてください。

---

**ぽちぽちメッズ** - 誰にでも優しい服薬管理アプリ 💊✨
