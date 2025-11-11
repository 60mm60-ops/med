import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ぽちぽちメッズ',
  description: '服薬管理と診察サポートを行うWebアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
