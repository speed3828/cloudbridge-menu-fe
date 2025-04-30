'use client';

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export function PerformanceMonitor() {
  const { metrics } = usePerformanceMonitor();

  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
      <h3 className="text-sm font-semibold mb-2">성능 모니터링</h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={metrics.fcp < 1800 ? 'text-green-600' : 'text-red-600'}>
            {metrics.fcp.toFixed(2)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={metrics.lcp < 2500 ? 'text-green-600' : 'text-red-600'}>
            {metrics.lcp.toFixed(2)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={metrics.fid < 100 ? 'text-green-600' : 'text-red-600'}>
            {metrics.fid.toFixed(2)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={metrics.cls < 0.1 ? 'text-green-600' : 'text-red-600'}>
            {metrics.cls.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={metrics.ttfb < 600 ? 'text-green-600' : 'text-red-600'}>
            {metrics.ttfb.toFixed(2)}ms
          </span>
        </div>
      </div>
    </div>
  );
} 