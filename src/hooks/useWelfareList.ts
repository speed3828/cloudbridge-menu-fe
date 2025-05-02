import { useState, useEffect } from 'react';

// 복지 프로그램 데이터 타입 정의
interface WelfareItem {
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

interface UseWelfareListReturn {
  welfareItems: WelfareItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 복지 프로그램 목록을 불러오는 훅
 */
export function useWelfareList(): UseWelfareListReturn {
  const [welfareItems, setWelfareItems] = useState<WelfareItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWelfareItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 요청
      const response = await fetch('/api/menu/welfare/list');
      
      if (!response.ok) {
        throw new Error(`API 요청 오류: ${response.status}`);
      }
      
      const data = await response.json();
      setWelfareItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
      console.error('복지 프로그램 목록 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchWelfareItems();
  }, []);

  return {
    welfareItems,
    loading,
    error,
    refetch: fetchWelfareItems
  };
}

export default useWelfareList; 