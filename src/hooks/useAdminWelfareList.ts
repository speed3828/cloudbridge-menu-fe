'use client';

import React from 'react';
import { useToast } from '@/contexts/ToastContext';
import { handleApiError, handleApiResponse } from '@/lib/api-helpers';

// 복지 프로그램 데이터 타입 정의
export interface WelfareItem {
  id: string;
  title: string;        // 프로그램명
  target_group: string; // 대상 그룹
  phone?: string;       // 연락처 (옵션)
  address?: string;     // 주소 (옵션)
  service_type?: string; // 서비스 유형 (옵션)
  thumbnail?: string;   // 대표 이미지 (옵션)
  description?: string; // 설명 (옵션)
  status: 'pending' | 'approved' | 'rejected'; // 상태
  created_at: string;   // 생성 일자
}

interface UseAdminWelfareListReturn {
  welfareItems: WelfareItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateWelfare: (id: string, data: Partial<WelfareItem>) => Promise<void>;
  approveWelfare: (id: string) => Promise<void>;
  rejectWelfare: (id: string) => Promise<void>;
}

/**
 * 관리자용 복지 프로그램 목록을 불러오는 훅
 */
export function useAdminWelfareList(): UseAdminWelfareListReturn {
  const [welfareItems, setWelfareItems] = React.useState<WelfareItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const { showToast } = useToast();

  const fetchWelfareItems = React.useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 요청
      const response = await fetch('/api/admin/welfare', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      const data = await handleApiResponse<WelfareItem[]>(response);
      setWelfareItems(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      showToast(errorMessage, 'error');
      console.error('복지 프로그램 목록 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 복지 프로그램 업데이트 함수
  const updateWelfare = React.useCallback(async (id: string, data: Partial<WelfareItem>): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/welfare/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const updatedItem = await handleApiResponse<WelfareItem>(response);
      
      // 업데이트 성공 시 목록 갱신
      setWelfareItems((prev: WelfareItem[]) => 
        prev.map((item: WelfareItem) => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      
      showToast('복지 프로그램이 업데이트되었습니다.', 'success');
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast(errorMessage, 'error');
      console.error('복지 프로그램 업데이트 오류:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 복지 프로그램 승인 함수
  const approveWelfare = React.useCallback(async (id: string): Promise<void> => {
    await updateWelfare(id, { status: 'approved' });
    showToast('복지 프로그램이 승인되었습니다.', 'success');
  }, [updateWelfare, showToast]);

  // 복지 프로그램 거부 함수
  const rejectWelfare = React.useCallback(async (id: string): Promise<void> => {
    await updateWelfare(id, { status: 'rejected' });
    showToast('복지 프로그램이 거부되었습니다.', 'warning');
  }, [updateWelfare, showToast]);

  // 초기 데이터 로딩
  React.useEffect(() => {
    fetchWelfareItems();
  }, [fetchWelfareItems]);

  return {
    welfareItems,
    loading,
    error,
    refetch: fetchWelfareItems,
    updateWelfare,
    approveWelfare,
    rejectWelfare
  };
} 