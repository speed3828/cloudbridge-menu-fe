'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Store } from '@/components/StoreCard';

export function useStoreList(section: string) {
  return useQuery<Store[]>({
    queryKey: ['stores', section],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stores/${section}`);
      return data;
    },
  });
} 