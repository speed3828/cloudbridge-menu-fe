'use client';

import { useEffect, useState } from 'react';
import { measurePerformance, logPerformanceMetrics, isPerformanceGood, type PerformanceMetrics } from '@/lib/performance';
import { useToast } from '@/contexts/ToastContext';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  // Use type assertion to help TypeScript understand the structure
  const toastContext = useToast() as ToastContextType;

  useEffect(() => {
    const measureAndLog = async () => {
      const performanceMetrics = await measurePerformance();
      setMetrics(performanceMetrics);
      logPerformanceMetrics(performanceMetrics);

      if (!isPerformanceGood(performanceMetrics)) {
        toastContext.showToast('페이지 로딩이 느립니다. 네트워크 상태를 확인해주세요.', 'warning');
      }
    };

    // 초기 측정
    measureAndLog();

    // 주기적 측정 (5분마다)
    const interval = setInterval(measureAndLog, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [toastContext]);

  return { metrics };
} 