'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SECTIONS, MenuSection } from '../config/sections';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">양평 메뉴</h1>
          <button 
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {SECTIONS.map((section: MenuSection) => {
              const isActive = pathname === `/menu/${section.key}` || pathname.includes(`/menu/${section.key}`);
              return (
                <Link
                  key={section.key}
                  href={`/menu/${section.key}`}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-sm text-gray-500 text-center">
            양평군 통합 플랫폼
          </div>
        </div>
      </div>
    </>
  );
};