import React from 'react';

// React 이벤트 타입 정의
interface ChangeEvent<T = Element> {
  target: T & {
    name: string;
    value: string;
  };
}

interface FormEvent {
  preventDefault(): void;
}

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

interface WelfareAdminDrawerProps {
  welfare: WelfareItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<WelfareItem>) => Promise<void>;
}

// Promise 타입 선언 (TypeScript가 ES2015.Promise를 인식하지 못하는 경우를 대비)
declare global {
  interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult>;
  }
}

const WelfareAdminDrawer = ({
  welfare,
  isOpen,
  onClose,
  onUpdate
}: WelfareAdminDrawerProps) => {
  const [formData, setFormData] = React.useState<Partial<WelfareItem>>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  
  // 초기 데이터 설정
  React.useEffect(() => {
    if (welfare) {
      setFormData({
        service_type: welfare.service_type || '',
        phone: welfare.phone || '',
        address: welfare.address || '',
        thumbnail: welfare.thumbnail || '',
        description: welfare.description || '',
        status: welfare.status
      });
    }
  }, [welfare]);
  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<WelfareItem>) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 폼 제출 핸들러
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    onUpdate(welfare.id, formData)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error updating welfare:', error);
        alert('업데이트 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* 드로어 */}
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">복지 프로그램 관리</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              title="닫기"
              aria-label="닫기"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">{welfare.title}</h3>
            <p className="text-sm text-gray-500">대상: {welfare.target_group}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 서비스 유형 */}
            <div>
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                서비스 유형
              </label>
              <input
                type="text"
                id="service_type"
                name="service_type"
                value={formData.service_type || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 연락처 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                연락처
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 주소 */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 썸네일 URL */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                썸네일 URL
              </label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            {/* 상태 선택 */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">검토중</option>
                <option value="approved">승인됨</option>
                <option value="rejected">거부됨</option>
              </select>
            </div>
            
            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelfareAdminDrawer; 