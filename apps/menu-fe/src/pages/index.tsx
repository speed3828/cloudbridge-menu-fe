'use client';

import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { SECTIONS } from '@/config/sections';
import { MenuLayout } from '@/components/MenuLayout';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>양평 통합 메뉴 - 양평군 디지털 플랫폼</title>
        <meta name="description" content="양평군의 모든 서비스를 한 곳에서" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuLayout>
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Hero Section */}
          <div className="px-6 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              양평군 통합 디지털 플랫폼
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              양평의 모든 서비스와 정보를 한 곳에서 만나보세요
            </p>
          </div>

          {/* Menu Grid */}
          <div className="px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                서비스 메뉴
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {SECTIONS.map((section) => (
                  <Link
                    key={section.key}
                    href={`/menu/${section.key}`}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{section.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {section.label}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {section.key === 'store' && '중고거래 및 구인구직'}
                        {section.key === 'yogiyo' && '맛집 및 음식점 정보'}
                        {section.key === 'tour' && '관광지 및 행사 정보'}
                        {section.key === 'welfare' && '복지 서비스'}
                        {section.key === 'gov' && '행정 서비스'}
                        {section.key === 'band' && '커뮤니티 및 동호회'}
                        {section.key === 'bazaar' && '장터 및 직거래'}
                        {section.key === 'live' && '실시간 정보'}
                        {section.key === 'story' && '지역 이야기 및 소식'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t px-6 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                양평군청 디지털 혁신과
              </h3>
              <p className="text-gray-600">
                주민 편의를 위한 디지털 서비스 통합 플랫폼
              </p>
            </div>
          </div>
        </div>
      </MenuLayout>
    </>
  );
};

export default Home; 