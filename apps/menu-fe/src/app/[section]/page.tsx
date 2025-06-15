'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/config/sections';
import { useStoreList } from '@/hooks/useStoreList';
import StoreCard from '@/components/StoreCard';
import SkeletonList from '@/components/SkeletonList';
import { MenuLayout } from '@/components/MenuLayout';

export default function SectionPage() {
  const pathname = usePathname() ?? '';
  const section = pathname.split('/').pop() ?? 'store';
  const currentSection = SECTIONS.find(s => s.key === section);
  const { data, isLoading } = useStoreList(section);

  return (
    <MenuLayout>
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentSection?.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentSection?.label}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {section === 'store' && '양평 지역의 중고거래 및 구인구직 정보'}
              {section === 'yogiyo' && '양평 지역의 맛집 및 음식점 정보'}
              {section === 'tour' && '양평 지역의 관광지 및 행사 정보'}
              {section === 'welfare' && '양평 지역의 복지 서비스 정보'}
              {section === 'gov' && '양평군 행정 서비스 정보'}
              {section === 'band' && '양평 지역 커뮤니티 및 동호회'}
              {section === 'bazaar' && '양평 지역 장터 및 직거래'}
              {section === 'live' && '양평 지역 실시간 정보'}
              {section === 'story' && '양평 지역 이야기 및 소식'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <SkeletonList />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.map((item: any) => (
              <StoreCard key={item.id} store={item} />
            ))}
          </div>
        )}
      </div>

      {/* 섹션 챗봇 iframe */}
      <div className="bg-white border-t">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {currentSection?.label} 챗봇 도우미
          </h3>
          <iframe
            title={`${section}-chatbot`}
            src={`https://bot.autoriseinsight.co.kr/?bot=${section}`}
            className="w-full h-96 border rounded-lg"
          />
        </div>
      </div>
    </MenuLayout>
  );
} 