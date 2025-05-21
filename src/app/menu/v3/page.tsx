'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { VirtualizedMenuGrid3 } from '@/components/menu/VirtualizedMenuGrid3';
import AIFeatures from '@/components/AIFeatures';
import type { MenuItem } from '@/types/menu';
import { SECTIONS } from '@/config/sections';

// 샘플 메뉴 데이터 - 다른 예제 데이터 사용
const SAMPLE_MENU_ITEMS: MenuItem[] = Array.from({ length: 120 }, (_, index) => ({
  id: `v3-item-${index + 1}`,
  name: `메뉴 그리드 V3 아이템 ${index + 1}`,
  description: `개선된 가상화 그리드로 렌더링된 메뉴 아이템 ${index + 1}입니다.`,
  price: Math.floor(Math.random() * 25000) + 8000,
  image: `/images/menu/item-${(index % 12) + 1}.jpg`,
  category: ['한식', '양식', '중식', '일식', '분식'][Math.floor(Math.random() * 5)],
  tags: [
    Math.random() > 0.7 ? '인기' : null,
    Math.random() > 0.8 ? '추천' : null,
    Math.random() > 0.9 ? '신메뉴' : null,
  ].filter(Boolean) as string[],
  isAvailable: Math.random() > 0.15
}));

// 요기요 섹션 사용 (메뉴와 가장 관련성 높음)
const menuSection = SECTIONS.find(section => section.key === 'yogiyo') || {
  key: 'menu',
  label: '메뉴',
  aiFeatures: {
    recommendations: true,
    imageRecognition: true,
    locationBased: true
  }
};

export default function VirtualizedGridV3Page() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSelectItem = (item: MenuItem) => {
    console.log('선택된 메뉴:', item);
    if (item.price !== undefined) {
      alert(`${item.name}을(를) 선택하셨습니다. 가격: ${item.price.toLocaleString()}원`);
    } else {
      alert(`${item.name}을(를) 선택하셨습니다.`);
    }
  };

  return (
    <MainLayout activeSection="menu">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            VirtualizedMenuGrid V3
          </h1>
          
          {/* AI 기능 섹션 */}
          <div className="mb-8">
            <AIFeatures section={menuSection} />
          </div>
          
          {/* 메뉴 그리드 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-purple-300 border-opacity-30 p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-purple-600 border-r-blue-400 border-b-purple-600 border-l-blue-400 rounded-full animate-spin mb-4"></div>
                  <p className="text-blue-300 text-xl">메뉴 불러오는 중...</p>
                </div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="flex justify-center items-center h-96 bg-gray-900 bg-opacity-50 rounded-lg p-8">
                <div className="text-center">
                  <p className="text-purple-400 text-2xl mb-4">메뉴가 없습니다</p>
                  <p className="text-blue-300">곧 새로운 메뉴가 추가될 예정입니다</p>
                </div>
              </div>
            ) : (
              <VirtualizedMenuGrid3 
                items={menuItems} 
                onSelectItem={handleSelectItem}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 