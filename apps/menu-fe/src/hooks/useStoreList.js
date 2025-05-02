'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Custom hook to fetch store list data based on section
 * @param {string} section - The section name to fetch stores for
 * @returns {Object} - Query result with data, loading and error states
 */
export function useStoreList(section) {
  return useQuery({
    queryKey: ['stores', section],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stores/${section}`);
      return data;
    },
  });
} 