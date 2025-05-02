'use client';

import { useApiQuery } from './useApi';
import { Store } from '@/types/store';

export function useStoreList(section: string) {
  return useApiQuery<Store[]>(['stores', section], `/api/stores/${section}`, {
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
} 