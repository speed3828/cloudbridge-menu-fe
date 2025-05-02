'use client';

import React from 'react';

// 메타데이터 정의
export const metadata = {
  title: 'Menu Section',
  description: 'Browse menu items by section',
};

// 페이지 매개변수 타입 정의
type PageProps = {
  params: {
    section: string;
  };
};

// 섹션 페이지 컴포넌트
export default function MenuSection({ params }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Menu Section: {params.section}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 메뉴 아이템이 여기에 표시됩니다 */}
        </div>
      </div>
    </main>
  );
} 