'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { MenuListAdvanced } from '@/components/menu/MenuListAdvanced';
import { MenuFilter } from '@/components/menu/MenuFilter';
import AIFeatures from '@/components/AIFeatures';
import type { MenuItem, MenuFilter as MenuFilterType } from '@/types/menu';
import { SECTIONS } from '@/config/sections';

// 샘플 메뉴 데이터 - 할인 및 태그 포함
const SAMPLE_MENU_ITEMS: MenuItem[] = Array.from({ length: 30 }, (_, index) => {
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
  
  // 카테고리 할당
  const categories = ['한식', '양식', '중식', '일식', '분식'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // 태그 할당
  const allTags = ['신메뉴', '계절한정', '프리미엄', '베스트셀러', '추천', '인기', '건강식', '매운맛', '단맛'];
  const tagCount = Math.floor(Math.random() * 3) + 1; // 1~3개 태그
  const selectedTags: string[] = [];
  
  for (let i = 0; i < tagCount; i++) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!selectedTags.includes(randomTag)) {
      selectedTags.push(randomTag);
    }
  }
  
  return {
    id: `filter-item-${index + 1}`,
    name: `${category} 메뉴 ${index + 1}`,
    description: `필터링 가능한 메뉴 아이템 ${index + 1}입니다. 이 메뉴는 ${category} 카테고리에 속합니다.`,
    price: discountedPrice,
    image: `/images/menu/item-${(index % 12) + 1}.jpg`,
    category,
    popular: isPopular,
    recommended: isRecommended,
    tags: selectedTags,
    isAvailable: Math.random() > 0.15,
    discount: hasDiscount ? {
      percentage: discountPercentage,
      originalPrice: `${originalPrice.toLocaleString()}원`
    } : undefined
  };
});

// 카테고리 및 태그 목록 추출
const allCategories = Array.from(new Set(SAMPLE_MENU_ITEMS.map(item => item.category || '')))
  .filter(Boolean);

const allTags = Array.from(
  new Set(
    SAMPLE_MENU_ITEMS
      .flatMap(item => item.tags || [])
      .filter(Boolean)
  )
);

// 가격 범위 계산
const priceRange = {
  min: Math.min(...SAMPLE_MENU_ITEMS.map(item => typeof item.price === 'number' ? item.price : 0)),
  max: Math.max(...SAMPLE_MENU_ITEMS.map(item => typeof item.price === 'number' ? item.price : 0))
};

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

export default function FilteredMenuPage() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [filter, setFilter] = React.useState<MenuFilterType>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid');

  // 필터 변경 핸들러
  const handleFilterChange = (newFilter: MenuFilterType) => {
    setFilter(newFilter);
    
    // 필터링된 항목 계산 (실제로는 API 요청 등으로 처리할 수 있음)
    setIsLoading(true);
    
    // 필터링 지연 시뮬레이션
    setTimeout(() => {
      const filteredItems = SAMPLE_MENU_ITEMS.filter(item => {
        // 카테고리 필터
        if (newFilter.category && item.category !== newFilter.category) {
          return false;
        }
        
        // 태그 필터
        if (newFilter.tags && newFilter.tags.length > 0) {
          if (!item.tags || !newFilter.tags.some(tag => item.tags?.includes(tag))) {
            return false;
          }
        }
        
        // 가격 범위 필터
        if (newFilter.priceRange && typeof item.price === 'number') {
          if (item.price < newFilter.priceRange.min || item.price > newFilter.priceRange.max) {
            return false;
          }
        }
        
        // 검색어 필터
        if (newFilter.searchQuery) {
          const query = newFilter.searchQuery.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(query);
          const descMatch = item.description.toLowerCase().includes(query);
          
          if (!nameMatch && !descMatch) {
            return false;
          }
        }
        
        // 판매 가능 여부 필터
        if (newFilter.showOnlyAvailable && !item.isAvailable) {
          return false;
        }
        
        return true;
      });
      
      setMenuItems(filteredItems);
      setIsLoading(false);
    }, 500);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            메뉴 필터링
          </h1>
          
          {/* AI 기능 섹션 */}
          <div className="mb-8">
            <AIFeatures section={menuSection} />
          </div>
          
          {/* 필터와 메뉴 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 필터 사이드바 */}
            <div className="lg:col-span-1">
              <MenuFilter 
                filter={filter}
                onFilterChange={handleFilterChange}
                categories={allCategories}
                tags={allTags}
                priceRange={priceRange}
              />
            </div>
            
            {/* 메뉴 목록 */}
            <div className="lg:col-span-3">
              {/* 레이아웃 전환 버튼 */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  {menuItems.length}개의 메뉴 표시 중
                </div>
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
                      <p className="text-blue-300 text-xl">메뉴 필터링 중...</p>
                    </div>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="flex justify-center items-center h-96 bg-gray-900 bg-opacity-50 rounded-lg p-8">
                    <div className="text-center">
                      <p className="text-indigo-400 text-2xl mb-4">해당하는 메뉴가 없습니다</p>
                      <p className="text-blue-300">다른 필터 옵션을 선택해 보세요</p>
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
        </div>
      </div>
    </MainLayout>
  );
} 