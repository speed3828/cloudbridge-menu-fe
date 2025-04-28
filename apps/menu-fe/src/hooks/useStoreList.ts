import { useState, useEffect } from 'react'

interface Store {
  id: string
  name: string
  // Add other store properties as needed
}

export const useStoreList = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/menu/store/list')
        if (!response.ok) {
          throw new Error('Failed to fetch stores')
        }
        const data = await response.json()
        setStores(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  return { stores, loading, error }
} 