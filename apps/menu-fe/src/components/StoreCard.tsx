'use client';

import * as React from 'react';
import Image from 'next/image';

export type Store = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  phone: string;
};

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
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