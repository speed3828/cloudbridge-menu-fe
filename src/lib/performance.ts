export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function measurePerformance(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.performance) {
      resolve({
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
      });
      return;
    }

    // TTFB 측정
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const ttfb = navigation.responseStart - navigation.requestStart;

    // FCP 측정
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformancePaintTiming;
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    // LCP 측정
    const lcpEntry = performance.getEntriesByName('largest-contentful-paint')[0] as PerformancePaintTiming;
    const lcp = lcpEntry ? lcpEntry.startTime : 0;

    // FID 측정
    const fidEntry = performance.getEntriesByName('first-input-delay')[0] as PerformanceEventTiming;
    const fid = fidEntry ? fidEntry.duration : 0;

    // CLS 측정
    const clsEntry = performance.getEntriesByName('cumulative-layout-shift')[0] as PerformanceLayoutShift;
    const cls = clsEntry ? clsEntry.value : 0;

    resolve({
      fcp,
      lcp,
      fid,
      cls,
      ttfb,
    });
  });
}

export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  console.log('Performance Metrics:', {
    'First Contentful Paint': `${metrics.fcp.toFixed(2)}ms`,
    'Largest Contentful Paint': `${metrics.lcp.toFixed(2)}ms`,
    'First Input Delay': `${metrics.fid.toFixed(2)}ms`,
    'Cumulative Layout Shift': metrics.cls.toFixed(2),
    'Time to First Byte': `${metrics.ttfb.toFixed(2)}ms`,
  });
}

export function isPerformanceGood(metrics: PerformanceMetrics): boolean {
  return (
    metrics.fcp < 1800 && // 1.8초
    metrics.lcp < 2500 && // 2.5초
    metrics.fid < 100 && // 100ms
    metrics.cls < 0.1 && // 0.1
    metrics.ttfb < 600 // 600ms
  );
} 