import React from 'react';
import WelfareAdminDrawer from '../../components/WelfareAdminDrawer';
import { WelfareItem } from '../../types/welfare';

// Import React and Promise type definitions
import '../../types/react';
import '../../types/promise';

// Using local type definitions instead of importing from 'next'
interface NextPageProps {
  [key: string]: any;
}

// Define NextPage using React namespace to access our custom FC type
type NextPage = React.FunctionComponent<NextPageProps>;

// 복지 프로그램 데이터 타입 정의 (없다면 여기서 정의)
// interface WelfareItem {
//   id: string;
//   title: string;        // 프로그램명
//   target_group: string; // 대상 그룹
//   phone?: string;       // 연락처 (옵션)
//   address?: string;     // 주소 (옵션)
//   service_type?: string; // 서비스 유형 (옵션)
//   thumbnail?: string;   // 대표 이미지 (옵션)
//   description?: string; // 설명 (옵션)
//   status: 'pending' | 'approved' | 'rejected'; // 상태
//   created_at: string;   // 생성 일자
// }

// 임시 데이터 (실제로는 useAdminWelfareList 훅 사용)
const DUMMY_ITEMS: WelfareItem[] = [
  {
    id: '1',
    title: '노인 건강 관리 프로그램',
    target_group: '어르신',
    phone: '031-123-4567',
    address: '경기도 양평군 양평읍 중앙로 123',
    service_type: '건강관리',
    thumbnail: 'https://via.placeholder.com/300x200?text=Senior+Health',
    description: '노인 건강 검진 및 운동 프로그램을 제공합니다.',
    status: 'approved',
    created_at: '2023-05-10T12:00:00Z'
  },
  {
    id: '2',
    title: '아동 교육 지원 서비스',
    target_group: '아동',
    phone: '031-234-5678',
    service_type: '교육',
    thumbnail: 'https://via.placeholder.com/300x200?text=Child+Education',
    description: '저소득층 아동을 위한 교육 지원 서비스입니다.',
    status: 'approved',
    created_at: '2023-05-11T14:30:00Z'
  },
  {
    id: '3',
    title: '장애인 문화체험 프로그램',
    target_group: '장애인',
    phone: '031-345-6789',
    address: '경기도 양평군 서종면 북한강로 789',
    service_type: '문화체험',
    thumbnail: 'https://via.placeholder.com/300x200?text=Culture+Program',
    description: '장애인을 위한 다양한 문화체험 프로그램을 제공합니다.',
    status: 'approved',
    created_at: '2023-05-12T10:15:00Z'
  },
  {
    id: '4',
    title: '청년 창업 지원 서비스',
    target_group: '청년',
    phone: '031-456-7890',
    service_type: '창업지원',
    thumbnail: 'https://via.placeholder.com/300x200?text=Youth+Startup',
    description: '청년 창업자를 위한 멘토링 및 자금 지원 서비스입니다.',
    status: 'pending',
    created_at: '2023-05-13T16:45:00Z'
  },
  {
    id: '5',
    title: '노인 돌봄 서비스',
    target_group: '어르신',
    phone: '031-567-8901',
    address: '경기도 양평군 양서면 양수로 234',
    service_type: '돌봄',
    thumbnail: 'https://via.placeholder.com/300x200?text=Senior+Care',
    description: '독거노인을 위한 방문 돌봄 서비스를 제공합니다.',
    status: 'approved',
    created_at: '2023-05-14T09:00:00Z'
  },
  {
    id: '6',
    title: '장애인 교육 프로그램',
    target_group: '장애인',
    thumbnail: 'https://via.placeholder.com/300x200?text=Disabled+Education',
    status: 'pending',
    created_at: '2023-05-15T11:20:00Z'
  }
];

const AdminWelfarePage = (): JSX.Element => {
  const [items, setItems] = React.useState<WelfareItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<WelfareItem['status'] | 'all'>('all');
  const [selectedWelfare, setSelectedWelfare] = React.useState<WelfareItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  
  // 데이터 불러오기 (실제 환경에서는 useAdminWelfareList 훅 사용)
  React.useEffect(() => {
    const fetchData = () => {
      try {
        // TODO: 실제 API 구현
        // const response = await fetch('/api/admin/welfare');
        // const data = await response.json();
        // setItems(data);
        
        // 임시 데이터 사용
        setItems(DUMMY_ITEMS);
      } catch (error) {
        console.error('Error fetching welfare data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 아이템 업데이트 핸들러
  const handleUpdateWelfare = (id: string, data: Partial<WelfareItem>): Promise<void> => {
    // 임시 함수를 정의하여 비동기 작업 수행
    const updateItem = async (): Promise<void> => {
      try {
        // TODO: 실제 API 구현
        // const response = await fetch(`/api/admin/welfare/${id}`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(data)
        // });
        
        // if (!response.ok) {
        //   throw new Error('Failed to update welfare');
        // }
        
        // 임시 데이터 업데이트
        setItems((prev: WelfareItem[]) => 
          prev.map((item: WelfareItem) => 
            item.id === id ? { ...item, ...data } : item
          )
        );
      } catch (error) {
        console.error('Error updating welfare:', error);
        throw error;
      }
    };
    
    // 비동기 함수 호출 및 Promise 반환
    return updateItem();
  };
  
  // 아이템 열기 핸들러
  const handleOpenDrawer = (welfare: WelfareItem) => {
    setSelectedWelfare(welfare);
    setIsDrawerOpen(true);
  };
  
  // 드로어 닫기 핸들러
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedWelfare(null);
  };
  
  // 필터링된 아이템 목록
  const filteredItems = statusFilter === 'all'
    ? items
    : items.filter((item: WelfareItem) => item.status === statusFilter);
  
  // 상태에 따른 배지 색상
  const getStatusBadgeClass = (status: WelfareItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 상태 텍스트 매핑
  const statusText: Record<WelfareItem['status'], string> = {
    pending: '검토중',
    approved: '승인됨',
    rejected: '거부됨'
  };
  
  // Use a simple type for the event parameter
  const handleFilterChange = (e: { target: { value: string } }) => {
    setStatusFilter(e.target.value as WelfareItem['status'] | 'all');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <head>
        <title>복지 프로그램 관리 - 관리자</title>
        <meta name="description" content="양평 복지 프로그램 관리자 페이지" />
      </head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">복지 프로그램 관리</h1>
        
        {/* 상태 필터 */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="status-filter" className="font-medium text-gray-700">상태 필터:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">전체 보기</option>
              <option value="pending">검토중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">거부됨</option>
            </select>
          </div>
        </div>
        
        {/* 테이블 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>조건에 맞는 복지 프로그램이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      프로그램명
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      대상
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      서비스 유형
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item: WelfareItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        {item.service_type && (
                          <div className="text-xs text-gray-500 mt-1">{item.service_type}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.target_group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.service_type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {statusText[item.status as keyof typeof statusText]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenDrawer(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          관리
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* 관리자 드로어 */}
        {selectedWelfare && (
          <WelfareAdminDrawer
            welfare={selectedWelfare}
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            onUpdate={handleUpdateWelfare}
          />
        )}
      </main>
    </div>
  );
};

export default AdminWelfarePage; 