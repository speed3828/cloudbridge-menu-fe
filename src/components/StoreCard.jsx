'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { formatPrice, truncateText } from '@/lib/utils';

/**
 * Store card component
 * @param {Object} props
 * @param {Object} props.store - Store object
 * @param {string} props.store.id - Store ID
 * @param {string} props.store.name - Store name
 * @param {string} props.store.description - Store description
 * @param {string} props.store.imageUrl - Store image URL
 * @param {string} props.store.price - Store price
 * @param {Function} [props.onSelect] - Optional callback when store is selected
 */
const StoreCard = React.memo(({ store, onSelect }) => {
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