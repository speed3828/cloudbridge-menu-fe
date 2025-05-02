// Welfare program type definitions for admin interface

/**
 * Welfare program item with administrative fields
 */
export interface WelfareItem {
  id: string;
  title: string;        // 프로그램명 (Program name)
  target_group: string; // 대상 그룹 (Target group)
  phone?: string;       // 연락처 (Contact phone - optional)
  address?: string;     // 주소 (Address - optional)
  service_type?: string; // 서비스 유형 (Service type - optional)
  thumbnail?: string;   // 대표 이미지 (Thumbnail image URL - optional)
  description?: string; // 설명 (Description - optional)
  status: 'pending' | 'approved' | 'rejected'; // 상태 (Status)
  created_at: string;   // 생성 일자 (Creation date)
}

/**
 * Request payload for creating a new welfare program
 */
export interface CreateWelfareRequest {
  title: string;
  target_group: string;
  phone?: string;
  address?: string;
  service_type?: string;
  thumbnail?: string;
  description?: string;
}

/**
 * Request payload for updating an existing welfare program
 */
export type UpdateWelfareRequest = Partial<Omit<WelfareItem, 'id' | 'created_at'>>; 