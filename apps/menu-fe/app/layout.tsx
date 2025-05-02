import './globals.css';
import React from 'react';

// 메타데이터 정의
export const metadata = {
  title: 'Cloudbridge Menu',
  description: 'Interactive menu platform powered by Cloudbridge',
};

// 루트 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
} 