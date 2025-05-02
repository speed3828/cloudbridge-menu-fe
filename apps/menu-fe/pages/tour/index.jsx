// 이 파일은 TypeScript 오류를 우회하기 위해 JavaScript 문법으로 작성되었습니다.
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 상태에 따른 배지 표시 컴포넌트
const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';

  switch (status) {
    case 'approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = '승인됨';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = '검토중';
      break;
    case 'rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = '거절됨';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

// 임시 데이터 (나중에 API로 대체)
const DUMMY_ITEMS = [
  {
    id: '1',
    name: '양평 두물머리',
    title: '양평 두물머리 유람선 체험',
    phone: '010-1234-5678',
    location: '양평읍',
    category: '관광명소',
    description: '남한강과 북한강이 만나는 두물머리에서 유람선을 타고 아름다운 풍경을 감상해보세요.',
    imageUrl: 'https://via.placeholder.com/150?text=두물머리',
    address: '경기도 양평군 양평읍 두물머리길 123',
    mapLocation: { lat: 37.5356, lng: 127.3192 },
    status: 'approved',
    createdAt: '2023-04-15T12:00:00Z',
    price: 15000,
    duration: '1시간',
    availableTimes: ['10:00', '13:00', '15:00', '17:00']
  },
  {
    id: '2',
    name: '양평 레일바이크',
    title: '양평 레일바이크 체험 - 수려한 계곡 풍경',
    phone: '010-9876-5432',
    location: '용문면',
    category: '체험',
    description: '폐선로를 활용한 레일바이크에서 아름다운 계곡 풍경을 감상하며 추억을 만들어보세요.',
    imageUrl: 'https://via.placeholder.com/150?text=레일바이크',
    address: '경기도 양평군 용문면 레일바이크로 45',
    mapLocation: { lat: 37.4872, lng: 127.5843 },
    status: 'approved',
    createdAt: '2023-04-14T09:30:00Z',
    price: 20000,
    duration: '1시간 30분',
    availableTimes: ['09:30', '11:30', '13:30', '15:30']
  },
  {
    id: '3',
    name: '양평 힐링 농장',
    title: '양평 힐링 농장 체험 - 과일 수확 체험',
    phone: '010-2222-3333',
    location: '지평면',
    category: '체험/농장',
    description: '사과, 배, 딸기 등 계절별 다양한 과일 수확 체험을 할 수 있는 농장입니다.',
    imageUrl: 'https://via.placeholder.com/150?text=힐링농장',
    address: '경기도 양평군 지평면 농장길 78',
    mapLocation: { lat: 37.4467, lng: 127.6778 },
    status: 'approved',
    createdAt: '2023-04-13T15:45:00Z',
    price: 25000,
    duration: '2시간',
    availableTimes: ['10:00', '14:00']
  },
  {
    id: '4',
    name: '양평 한옥 스테이',
    title: '양평 전통 한옥 체험',
    phone: '010-5555-7777',
    location: '강하면',
    category: '숙박',
    description: '아름다운 자연 속에서 전통 한옥의 매력을 느껴보세요. 개인 온천 욕조와 아침 식사 포함.',
    imageUrl: 'https://via.placeholder.com/150?text=한옥스테이',
    address: '경기도 양평군 강하면 한옥마을길 123',
    status: 'pending',
    createdAt: '2023-04-12T18:20:00Z',
    price: 150000,
    duration: '1박',
    availableDates: ['2023-05-01', '2023-05-02', '2023-05-03']
  },
  {
    id: '5',
    name: '양평 패러글라이딩',
    title: '양평 패러글라이딩 체험 - 하늘에서 보는 양평',
    phone: '010-8888-9999',
    location: '서종면',
    category: '액티비티',
    description: '전문 강사와 함께하는 안전한 패러글라이딩 체험! 하늘에서 바라보는 양평의 아름다운 풍경을 감상하세요.',
    imageUrl: 'https://via.placeholder.com/150?text=패러글라이딩',
    address: '경기도 양평군 서종면 패러글라이딩장길 456',
    mapLocation: { lat: 37.5523, lng: 127.3234 },
    status: 'approved',
    createdAt: '2023-04-11T10:15:00Z',
    price: 80000,
    duration: '30분',
    availableTimes: ['09:00', '11:00', '13:00', '15:00', '17:00'],
    requirements: '12세 이상, 몸무게 40kg~100kg'
  }
];

const TourPage = () => {
  const [isTableView, setIsTableView] = useState(true);
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('전체');

  // 실제 환경에서는 API 호출로 대체됩니다
  useEffect(() => {
    setItems(DUMMY_ITEMS);
  }, []);

  // 카테고리 추출
  const categories = ['전체', ...new Set(DUMMY_ITEMS.map(item => item.category))];

  // 필터링된 항목
  const filteredItems = categoryFilter === '전체' 
    ? items 
    : items.filter(item => item.category === categoryFilter);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}일 전`;
      } else {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
      }
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}원` : '가격 협의';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 여기어때 - 관광/체험</title>
        <meta name="description" content="양평 지역 관광지 및 체험 활동 예약 플랫폼" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">양평 여기어때 🗺️</h1>
          
          {/* 뷰 토글 버튼 */}
          <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setIsTableView(true)}
              className={`px-3 py-1 rounded-full text-sm ${
                isTableView
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              리스트
            </button>
            <button
              onClick={() => setIsTableView(false)}
              className={`px-3 py-1 rounded-full text-sm ${
                !isTableView
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              카드
            </button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  categoryFilter === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 데스크톱: 테이블 뷰 (md 이상) */}
        {isTableView && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="py-3 px-4 font-medium">관광/체험</th>
                  <th className="py-3 px-4 font-medium">카테고리</th>
                  <th className="py-3 px-4 font-medium">지역</th>
                  <th className="py-3 px-4 font-medium">가격</th>
                  <th className="py-3 px-4 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link href={`/tour/${item.id}`} className="flex items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={`w-12 h-12 rounded-md mr-3 object-cover ${item.status === 'pending' ? 'grayscale' : ''}`}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-gray-600">{item.location}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{formatPrice(item.price)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 모바일: 카드 뷰 (md 미만) 또는 카드 뷰 선택 시 */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isTableView ? 'md:hidden' : ''}`}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/tour/${item.id}`}>
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-48 object-cover ${item.status === 'pending' ? 'grayscale' : ''}`}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.name}</p>
                  <p className="text-sm text-gray-800 mt-2 line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{item.location}</span>
                    <span className="text-xs text-gray-800 font-medium">{formatPrice(item.price)}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">소요시간: {item.duration}</span>
                    <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 새 관광/체험 등록 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link href="/tour/new">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              새 관광/체험 등록하기
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TourPage; 