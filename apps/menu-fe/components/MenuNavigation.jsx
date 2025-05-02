'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SECTIONS } from '../config/sections';

export const MenuNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 p-4 bg-white shadow-sm">
      {SECTIONS.map((section) => {
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
    </nav>
  );
}; 