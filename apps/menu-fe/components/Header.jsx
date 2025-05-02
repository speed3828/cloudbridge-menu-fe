'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuNavigation } from './MenuNavigation.jsx';

export const Header = () => {
  const pathname = usePathname();
  const isStoreSection = pathname && pathname.indexOf('/store') !== -1; // Using indexOf instead of includes

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Cloudbridge Menu
          </Link>
          
          {/* Desktop Write Button - 미디엄 이상의 화면에서만 표시 */}
          {isStoreSection && (
            <Link
              href="/store/new"
              className="hidden md:flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              <span>🥕</span>
              <span>글쓰기</span>
            </Link>
          )}
        </div>
      </div>
      <MenuNavigation />
      
      {/* Mobile FAB (Floating Action Button) - 모바일 화면에서만 표시 */}
      {isStoreSection && (
        <Link
          href="/store/new"
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          aria-label="글쓰기"
        >
          <span className="text-xl">🥕</span>
        </Link>
      )}
    </header>
  );
}; 