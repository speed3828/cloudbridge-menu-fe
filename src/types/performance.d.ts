// Performance API 타입 정의 확장
interface PerformanceLayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
} 