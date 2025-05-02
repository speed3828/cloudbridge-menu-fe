'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/config/sections';

/**
 * 메뉴 탭 컴포넌트
 */
export default function MenuTabs() {
  const pathname = usePathname() ?? '';
  const current = pathname.split('/').pop() ?? 'store';

  return (
    <nav className="flex gap-2 overflow-x-auto border-b">
      {SECTIONS.map(s => (
        <Link
          key={s.key}
          href={`/menu/${s.key}`}
          className={`px-4 py-2 whitespace-nowrap ${
            current === s.key ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
        >
          <span className="mr-1">{s.icon}</span>
          {s.label}
        </Link>
      ))}
    </nav>
  );
} 