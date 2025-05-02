'use client';

import React from 'react';
import Image from 'next/image';

/**
 * 상점 카드 컴포넌트
 * @param {Object} props - 컴포넌트 프롭스
 * @param {Object} props.store - 상점 정보
 * @param {string} props.store.id - 상점 ID
 * @param {string} props.store.name - 상점 이름
 * @param {string} props.store.description - 상점 설명
 * @param {string} props.store.imageUrl - 상점 이미지 URL
 * @param {string} props.store.address - 상점 주소
 * @param {string} props.store.phone - 상점 전화번호
 */
export default function StoreCard({ store }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-48">
        <Image
          src={store.imageUrl}
          alt={store.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{store.description}</p>
        <div className="text-sm text-gray-500">
          <p>{store.address}</p>
          <p>{store.phone}</p>
        </div>
      </div>
    </div>
  );
} 