import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Store {
  id: string
  name: string
  description: string
  section: string
}

const fetchStores = async (): Promise<Store[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/store/list`)
  return data
}

export function useStoreList() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
  })
} 