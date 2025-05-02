import React from 'react';

// 섹션별 메타데이터 생성
export function generateMetadata({ params }: { params: { section: string } }) {
  return {
    title: `${params.section} 메뉴 섹션`,
    description: `${params.section} 카테고리의 메뉴 항목을 찾아보세요`,
  };
}

// 섹션 레이아웃 컴포넌트
export default function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { section: string };
}) {
  return (
    <div className="section-layout">
      <div className="section-header bg-gray-100 p-4 mb-6">
        <h2 className="text-xl font-bold">{params.section} 섹션</h2>
        <p className="text-sm text-gray-600">맛있는 메뉴를 탐색해보세요</p>
      </div>
      {children}
    </div>
  );
} 