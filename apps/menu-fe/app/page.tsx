'use client';

import React from 'react';

// 메인 페이지 컴포넌트
export default function MenuLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Cloudbridge Menu</h1>
        <p className="text-xl mb-4">Your interactive menu platform</p>
        
        {/* 섹션 링크 추가 */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <a href="/korean" className="p-4 border rounded-lg text-center hover:bg-gray-100">
            Korean Food
          </a>
          <a href="/chinese" className="p-4 border rounded-lg text-center hover:bg-gray-100">
            Chinese Food
          </a>
          <a href="/japanese" className="p-4 border rounded-lg text-center hover:bg-gray-100">
            Japanese Food
          </a>
          <a href="/western" className="p-4 border rounded-lg text-center hover:bg-gray-100">
            Western Food
          </a>
        </div>
      </div>
    </main>
  );
} 