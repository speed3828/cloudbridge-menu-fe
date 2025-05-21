'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SECTIONS, MenuSection } from '@/config/sections';

export const MenuNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 p-4 bg-white shadow-sm">
      {SECTIONS.map((section: MenuSection) => {
        const isActive = pathname === `/menu/${section.key}`;
        return (
          <Link
            key={section.key}
            href={`/menu/${section.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </Link>
        );
      })}
      
      {/* 새로운 메뉴 페이지 링크 */}
      <Link
        href="/menu/new"
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          pathname === '/menu/new'
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <span>🆕</span>
        <span>개선된 메뉴</span>
      </Link>

      {/* VirtualizedMenuGrid V3 페이지 링크 */}
      <Link
        href="/menu/v3"
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          pathname === '/menu/v3'
            ? 'bg-purple-100 text-purple-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <span>🌐</span>
        <span>V3 그리드</span>
      </Link>
      
      {/* 고급 메뉴 목록 페이지 링크 */}
      <Link
        href="/menu/advanced"
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          pathname === '/menu/advanced'
            ? 'bg-indigo-100 text-indigo-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <span>✨</span>
        <span>고급 메뉴</span>
      </Link>
      
      {/* 필터링 메뉴 페이지 링크 */}
      <Link
        href="/menu/filter"
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          pathname === '/menu/filter'
            ? 'bg-teal-100 text-teal-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <span>🔍</span>
        <span>필터 메뉴</span>
      </Link>
    </nav>
  );
}; 