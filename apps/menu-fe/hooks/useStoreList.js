import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * @typedef {Object} Store
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} section
 */

/**
 * Fetches the list of stores from the API
 * @returns {Promise<Store[]>}
 */
const fetchStores = async () => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api'
  const { data } = await axios.get(`${apiBase}/store/list`)
  return data
}

/**
 * Custom hook to fetch and manage store list data
 */
export function useStoreList() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 