'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { formatPrice, truncateText } from '@/lib/utils';

export type Store = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

interface StoreCardProps {
  store: Store;
  onSelect?: (store: Store) => void;
}

const StoreCard = React.memo(({ store, onSelect }: StoreCardProps) => {
  const handleClick = React.useCallback(() => {
    onSelect?.(store);
  }, [onSelect, store]);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={store.imageUrl}
          alt={`${store.name} 이미지`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {truncateText(store.description, 100)}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-blue-600 font-medium">{store.price}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            aria-label={`${store.name} 선택하기`}
          >
            선택
          </Button>
        </div>
      </div>
    </article>
  );
});

StoreCard.displayName = 'StoreCard';

export default StoreCard; 