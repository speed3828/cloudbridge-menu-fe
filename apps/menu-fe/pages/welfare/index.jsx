import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 임시 데이터
const DUMMY_ITEMS = [
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
  }
];

// 대상 그룹 필터 옵션
const TARGET_GROUPS = [
  '전체',
  '어르신',
  '장애인',
  '아동',
  '청년'
];

/**
 * 복지 프로그램 목록 페이지
 */
const WelfarePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetGroupFilter, setTargetGroupFilter] = useState('전체');
  
  // 데이터 불러오기 (실제 환경에서는 useWelfareList 훅 사용)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: 실제 API 구현
        // const response = await fetch('/api/menu/welfare/list');
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
  
  // 대상 그룹 필터링
  const filteredItems = targetGroupFilter === '전체'
    ? items
    : items.filter(item => item.target_group === targetGroupFilter);
  
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 복지 - 복지 프로그램</title>
        <meta name="description" content="양평 지역 복지 프로그램 정보" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">양평 복지 프로그램 💙</h1>
          
          <Link href="/welfare/new" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            프로그램 제안하기
          </Link>
        </div>
        
        {/* 대상 그룹 필터 */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {TARGET_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setTargetGroupFilter(group)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  targetGroupFilter === group
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
        
        {/* 복지 프로그램 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/welfare/${item.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={item.title}
                  className={`w-full h-full object-cover ${item.status === 'pending' ? 'grayscale' : ''}`}
                />
                <div className="absolute top-2 right-2">
                  {item.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      검토중
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-2 px-3">
                  <h3 className="text-white font-bold truncate">{item.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">대상: {item.target_group}</p>
                    {item.service_type && (
                      <p className="text-xs text-gray-500">{item.service_type}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">해당 대상의 등록된 프로그램이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WelfarePage; 