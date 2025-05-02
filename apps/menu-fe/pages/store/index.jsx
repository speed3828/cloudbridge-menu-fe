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
    name: '양평 자전거',
    title: '양평 자전거 대여 - 강변 자전거 라이딩',
    phone: '010-1234-5678',
    location: '양평읍',
    category: '스포츠/레저',
    description: '양평 한강변을 따라 자전거를 대여해드립니다. 1시간, 2시간, 4시간 코스 있음.',
    imageUrl: 'https://via.placeholder.com/150',
    address: '경기도 양평군 양평읍 강변로 123',
    mapLocation: { lat: 37.4894, lng: 127.4943 },
    status: 'approved',
    createdAt: '2023-04-15T12:00:00Z'
  },
  {
    id: '2',
    name: '양평 전자상가',
    title: '중고 아이폰 판매합니다',
    price: 700000,
    phone: '010-9876-5432',
    location: '양서면',
    category: '전자기기',
    description: '애플케어+ 적용 중입니다. 상태 A급',
    imageUrl: 'https://via.placeholder.com/150',
    status: 'approved',
    createdAt: '2023-04-14T09:30:00Z'
  },
  {
    id: '3',
    name: '양평 가구',
    title: '원목 가구 전문점',
    phone: '010-2222-3333',
    location: '개군면',
    category: '가구/인테리어',
    description: '친환경 원목가구를 제작/판매합니다. 맞춤제작 가능.',
    imageUrl: 'https://via.placeholder.com/150',
    address: '경기도 양평군 개군면 개군길 78',
    mapLocation: { lat: 37.4567, lng: 127.5678 },
    status: 'approved',
    createdAt: '2023-04-13T15:45:00Z'
  },
  {
    id: '4',
    name: '멍멍이 용품점',
    title: '반려동물 용품 전문점',
    phone: '010-5555-7777',
    location: '양평읍',
    category: '반려동물용품',
    description: '강아지 장난감, 사료, 간식 등 다양한 반려동물 용품을 판매합니다.',
    imageUrl: 'https://via.placeholder.com/150',
    status: 'pending',
    createdAt: '2023-04-12T18:20:00Z'
  },
  {
    id: '5',
    name: '양평 캠핑샵',
    title: '캠핑용품 대여/판매',
    phone: '010-8888-9999',
    location: '옥천면',
    category: '스포츠/레저',
    description: '텐트, 의자, 테이블 등 캠핑 용품을 대여 및 판매합니다. 양평 당일배송 가능.',
    imageUrl: 'https://via.placeholder.com/150',
    address: '경기도 양평군 옥천면 옥천로 456',
    mapLocation: { lat: 37.5123, lng: 127.6234 },
    openChatUrl: 'https://open.kakao.com/example',
    status: 'approved',
    createdAt: '2023-04-11T10:15:00Z'
  }
];

const StorePage = () => {
  const [isTableView, setIsTableView] = useState(true);
  const [items, setItems] = useState([]);

  // 실제 환경에서는 API 호출로 대체됩니다
  useEffect(() => {
    setItems(DUMMY_ITEMS);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 당근 - 상점/서비스</title>
        <meta name="description" content="양평 지역 상점 및 서비스 플랫폼" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">양평 당근 🥕</h1>
          
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

        {/* 데스크톱: 테이블 뷰 (md 이상) */}
        {isTableView && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="py-3 px-4 font-medium">상점/서비스</th>
                  <th className="py-3 px-4 font-medium">카테고리</th>
                  <th className="py-3 px-4 font-medium">지역</th>
                  <th className="py-3 px-4 font-medium">등록일</th>
                  <th className="py-3 px-4 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link href={`/store/${item.id}`} className="flex items-center">
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
                    <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(item.createdAt)}</td>
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
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/store/${item.id}`}>
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
                    <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 새 상점/서비스 등록 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link href="/store/new">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              새 상점/서비스 등록하기
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StorePage; 