import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/config/api';
import { ApiResponse, ApiError } from '@/types/api';

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<T>>(url);
      return data;
    },
    ...options,
  });
}

export function useApiMutation<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.post<ApiResponse<T>>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiPut<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.put<ApiResponse<T>>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiDelete<T>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, void>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, ApiError, void>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ApiResponse<T>>(url);
      return data;
    },
    ...options,
  });
} 