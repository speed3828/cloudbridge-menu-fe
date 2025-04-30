import { renderHook, waitFor } from '@testing-library/react';
import { useStoreList } from '../useStoreList';
import { apiClient } from '@/config/api';

// Mock apiClient
jest.mock('@/config/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('useStoreList', () => {
  const mockStores = [
    {
      id: '1',
      name: '테스트 가게 1',
      description: '테스트 설명 1',
      imageUrl: '/test-image-1.jpg',
      price: '10,000원',
    },
    {
      id: '2',
      name: '테스트 가게 2',
      description: '테스트 설명 2',
      imageUrl: '/test-image-2.jpg',
      price: '20,000원',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches stores successfully', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockStores });

    const { result } = renderHook(() => useStoreList('store'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockStores);
    expect(apiClient.get).toHaveBeenCalledWith('/api/stores/store');
  });

  it('handles error when fetching stores', async () => {
    const error = new Error('API Error');
    (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStoreList('store'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });
}); 