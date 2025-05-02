import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 카테고리 필터 옵션
const CATEGORIES = [
  '전체',
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '치킨',
  '피자',
  '패스트푸드',
  '카페/디저트',
  '아시안',
  '기타'
];

// 임시 데이터
const DUMMY_ITEMS = [
  {
    id: '1',
    name: '양평 한식당',
    category: '한식',
    rating: 4.5,
    phone: '010-1234-5678',
    address: '경기도 양평군 양평읍 양평로 123',
    menuUrl: 'https://example.com/menu1',
    imageUrl: 'https://via.placeholder.com/300x200?text=Korean+Food',
    images: [
      'https://via.placeholder.com/800x600?text=Image+1',
      'https://via.placeholder.com/800x600?text=Image+2'
    ],
    description: '양평 특산물로 만든 정갈한 한식을 제공합니다.',
    status: 'approved',
    createdAt: '2023-04-10T12:00:00Z'
  },
  {
    id: '2',
    name: '양평 중화요리',
    category: '중식',
    rating: 4.2,
    phone: '010-2345-6789',
    address: '경기도 양평군 양평읍 중앙로 45',
    imageUrl: 'https://via.placeholder.com/300x200?text=Chinese+Food',
    status: 'approved',
    createdAt: '2023-04-11T14:30:00Z'
  },
  {
    id: '3',
    name: '양평 카페',
    category: '카페/디저트',
    rating: 4.7,
    phone: '010-3456-7890',
    address: '경기도 양평군 서종면 북한강로 789',
    menuUrl: 'https://example.com/menu3',
    imageUrl: 'https://via.placeholder.com/300x200?text=Cafe',
    images: [
      'https://via.placeholder.com/800x600?text=Cafe+1',
      'https://via.placeholder.com/800x600?text=Cafe+2',
      'https://via.placeholder.com/800x600?text=Cafe+3'
    ],
    description: '양평 북한강이 보이는 전망 좋은 카페입니다.',
    status: 'approved',
    createdAt: '2023-04-12T10:15:00Z'
  },
  {
    id: '4',
    name: '양평 피자',
    category: '피자',
    rating: 4.0,
    phone: '010-4567-8901',
    address: '경기도 양평군 양평읍 시민로 56',
    imageUrl: 'https://via.placeholder.com/300x200?text=Pizza',
    status: 'pending',
    createdAt: '2023-04-13T16:45:00Z'
  },
  {
    id: '5',
    name: '양평 일식',
    category: '일식',
    rating: 4.8,
    phone: '010-5678-9012',
    address: '경기도 양평군 양서면 양수로 234',
    menuUrl: 'https://example.com/menu5',
    imageUrl: 'https://via.placeholder.com/300x200?text=Japanese+Food',
    description: '신선한 회와 일식 요리를 제공합니다.',
    status: 'approved',
    createdAt: '2023-04-14T09:00:00Z'
  },
  {
    id: '6',
    name: '양평 치킨',
    category: '치킨',
    rating: 4.3,
    phone: '010-6789-0123',
    address: '경기도 양평군 양평읍 군청로 100',
    imageUrl: 'https://via.placeholder.com/300x200?text=Chicken',
    status: 'pending',
    createdAt: '2023-04-15T18:30:00Z'
  }
];

/**
 * 요기요 맛집 목록 페이지
 */
const YogiyoPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  
  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: 실제 API 구현
        // const response = await fetch('/api/menu/yogiyo');
        // const data = await response.json();
        // setItems(data);
        
        // 임시 데이터 사용
        setItems(DUMMY_ITEMS);
      } catch (error) {
        console.error('Error fetching yogiyo data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 카테고리 필터링
  const filteredItems = categoryFilter === '전체'
    ? items
    : items.filter(item => item.category === categoryFilter);
  
  // 별점 표시 컴포넌트
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(rating)
                  ? 'text-yellow-400'
                  : star <= rating + 0.5
                  ? 'text-yellow-300'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 요기요 - 맛집/음식점</title>
        <meta name="description" content="양평 지역 맛집 및 음식점 정보" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">양평 요기요 🍽️</h1>
          
          <Link href="/yogiyo/new" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            식당 등록하기
          </Link>
        </div>
        
        {/* 카테고리 필터 */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  categoryFilter === category
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* 식당 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/yogiyo/${item.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
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
                  <h3 className="text-white font-bold truncate">{item.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                    <RatingStars rating={item.rating} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">해당 카테고리의 등록된 식당이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default YogiyoPage; 