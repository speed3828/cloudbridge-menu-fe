'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { MenuListAdvanced } from '@/components/menu/MenuListAdvanced';
import AIFeatures from '@/components/AIFeatures';
import type { MenuItem } from '@/types/menu';
import { SECTIONS } from '@/config/sections';

// 샘플 메뉴 데이터 - 할인 및 태그 포함
const SAMPLE_MENU_ITEMS: MenuItem[] = Array.from({ length: 16 }, (_, index) => {
  // 할인 정보 랜덤 생성
  const hasDiscount = Math.random() > 0.7;
  const originalPrice = Math.floor(Math.random() * 30000) + 10000;
  const discountPercentage = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
  const discountedPrice = hasDiscount 
    ? Math.round(originalPrice * (1 - discountPercentage / 100)) 
    : originalPrice;
  
  // 인기 및 추천 여부 랜덤 결정
  const isPopular = Math.random() > 0.8;
  const isRecommended = !isPopular && Math.random() > 0.8;
  
  return {
    id: `advanced-item-${index + 1}`,
    name: `고급 메뉴 ${index + 1}`,
    description: `CSS 클래스 기반 스타일링이 적용된 메뉴 아이템 ${index + 1}입니다. 다양한 상태와 특성을 시각적으로 표현합니다.`,
    price: discountedPrice,
    image: `/images/menu/item-${(index % 12) + 1}.jpg`,
    category: ['한식', '양식', '중식', '일식', '분식'][Math.floor(Math.random() * 5)],
    popular: isPopular,
    recommended: isRecommended,
    tags: [
      Math.random() > 0.5 ? '신메뉴' : null,
      Math.random() > 0.7 ? '계절한정' : null,
      Math.random() > 0.8 ? '프리미엄' : null,
    ].filter(Boolean) as string[],
    isAvailable: Math.random() > 0.1,
    discount: hasDiscount ? {
      percentage: discountPercentage,
      originalPrice: `${originalPrice.toLocaleString()}원`
    } : undefined
  };
});

// 요기요 섹션 사용 (메뉴와 가장 관련성 높음)
const menuSection = SECTIONS.find(section => section.key === 'yogiyo') || {
  key: 'menu',
  label: '메뉴',
  aiFeatures: {
    chatbot: true,
    imageRecognition: true,
    recommendations: true
  }
};

export default function AdvancedMenuPage() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid');

  const handleSelectItem = (item: MenuItem) => {
    console.log('선택된 메뉴:', item);
    if (item.price !== undefined) {
      alert(`${item.name}을(를) 선택하셨습니다. 가격: ${item.price.toLocaleString()}원`);
    } else {
      alert(`${item.name}을(를) 선택하셨습니다.`);
    }
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <MainLayout activeSection="menu">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            고급 메뉴 목록
          </h1>
          
          {/* AI 기능 섹션 */}
          <div className="mb-8">
            <AIFeatures section={menuSection} />
          </div>
          
          {/* 레이아웃 전환 버튼 */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLayout}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {layout === 'grid' ? '목록 보기' : '그리드 보기'}
            </button>
          </div>
          
          {/* 메뉴 목록 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-indigo-300 border-opacity-30 p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-blue-500 border-b-indigo-500 border-l-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-blue-300 text-xl">메뉴 불러오는 중...</p>
                </div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="flex justify-center items-center h-96 bg-gray-900 bg-opacity-50 rounded-lg p-8">
                <div className="text-center">
                  <p className="text-indigo-400 text-2xl mb-4">메뉴가 없습니다</p>
                  <p className="text-blue-300">곧 새로운 메뉴가 추가될 예정입니다</p>
                </div>
              </div>
            ) : (
              <MenuListAdvanced 
                items={menuItems} 
                layout={layout}
                onSelectItem={handleSelectItem}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 