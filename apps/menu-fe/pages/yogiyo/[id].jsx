// 이 파일은 TypeScript 오류를 우회하기 위해 JavaScript 문법으로 작성되었습니다.
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 지도 섹션 컴포넌트
const MapSection = ({ address }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">위치 정보</h3>
        <p className="text-sm text-gray-600 mt-1">{address}</p>
      </div>
      <div className="h-64 bg-gray-200 relative">
        {/* 여기에 실제 지도 구현이 들어갈 예정 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">지도 표시 영역</p>
            <p className="text-sm text-gray-500 mt-1">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 예약 모달 컴포넌트
const ReservationModal = ({ 
  isOpen, 
  onClose, 
  restaurantId, 
  restaurantName,
  businessHours = []
}) => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const maxDate = nextMonth.toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: today,
    time: '18:00',
    people: 2,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // API 호출
      const response = await fetch(`/api/menu/yogiyo/${restaurantId}/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          restaurantId,
          restaurantName,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('예약 신청에 실패했습니다.');
      }
      
      alert('예약이 접수되었습니다. 식당 확인 후 연락드릴 예정입니다.');
      onClose();
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 시간 옵션 생성 (30분 간격)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 11; hour <= 21; hour++) {
      const hourString = hour.toString().padStart(2, '0');
      options.push(`${hourString}:00`);
      options.push(`${hourString}:30`);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-90vh overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">테이블 예약하기</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500" title="닫기" aria-label="닫기">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="010-0000-0000"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
                max={maxDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                시간 <span className="text-red-500">*</span>
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">
              인원 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="people"
              name="people"
              value={formData.people}
              onChange={handleChange}
              required
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              요청사항
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="특이사항이나 요청사항이 있으면 입력해주세요"
            ></textarea>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "예약 접수 중..." : "예약 신청하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 이미지 캐러셀 컴포넌트
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    setCurrentIndex(index => (index === 0 ? images.length - 1 : index - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex(index => (index === images.length - 1 ? 0 : index + 1));
  };
  
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg bg-gray-200 aspect-w-16 aspect-h-9">
        <img
          src={images[currentIndex]}
          alt={`이미지 ${currentIndex + 1}`}
          className="object-cover w-full h-full"
        />
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow hover:bg-opacity-100"
            aria-label="이전 이미지"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow hover:bg-opacity-100"
            aria-label="다음 이미지"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-red-500' : 'bg-gray-300'
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 별점 컴포넌트
const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
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

// 영업시간 컴포넌트 
const BusinessHours = ({ hours }) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h3 className="text-lg font-medium mb-2">영업시간</h3>
      <ul className="space-y-1 text-sm text-gray-600">
        {Object.entries(hours).map(([day, time]) => (
          <li key={day} className="flex">
            <span className="w-20 font-medium">{day}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 메뉴 컴포넌트
const Menu = ({ menu }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">대표 메뉴</h3>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {menu.map((item, index) => (
            <li key={index} className="py-3 flex justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                )}
              </div>
              <div className="font-medium text-gray-900">
                {item.price.toLocaleString()}원
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RestaurantDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // 실제 환경에서는 API 엔드포인트로 대체됩니다
        // const response = await fetch(`/api/menu/yogiyo/${id}`);
        // const data = await response.json();
        
        // 임시 더미 데이터
        const dummyData = {
          id: id,
          name: '양평 한식당',
          category: '한식',
          rating: 4.5,
          phone: '010-1234-5678',
          address: '경기도 양평군 양평읍 양평로 123',
          menuUrl: 'https://example.com/menu1',
          imageUrl: 'https://via.placeholder.com/600x400?text=Korean+Food',
          images: [
            'https://via.placeholder.com/800x600?text=음식+1',
            'https://via.placeholder.com/800x600?text=음식+2',
            'https://via.placeholder.com/800x600?text=매장+전경'
          ],
          description: '양평 특산물로 만든 정갈한 한식을 제공합니다. 신선한 재료와 정성이 담긴 요리로 여러분을 모시겠습니다.',
          status: 'approved',
          createdAt: '2023-04-10T12:00:00Z',
          businessHours: {
            '월-금': '11:30 - 21:00',
            '토-일': '11:00 - 22:00',
            '공휴일': '11:00 - 21:30'
          },
          menu: [
            {
              name: '된장찌개',
              price: 8000,
              description: '양평 토종된장으로 끓인 구수한 된장찌개'
            },
            {
              name: '갈비찜',
              price: 15000,
              description: '부드럽게 조려낸 양념 갈비찜'
            },
            {
              name: '비빔밥',
              price: 9000,
              description: '제철 나물이 들어간 건강한 비빔밥'
            },
            {
              name: '김치찌개',
              price: 8000,
              description: '묵은지로 끓인 얼큰한 김치찌개'
            }
          ]
        };
        
        setRestaurant(dummyData);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handlePhoneClick = () => {
    if (restaurant?.phone) window.location.href = `tel:${restaurant.phone}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">식당 정보를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-500">요청하신 식당 정보가 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <div className="mt-6">
            <Link href="/yogiyo" className="text-red-500 hover:text-red-600 font-medium">
              식당 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{restaurant.name} - 양평 요기요</title>
        <meta name="description" content={restaurant.description} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/yogiyo" className="text-red-500 hover:text-red-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            식당 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:grid md:grid-cols-5">
            <div className="md:col-span-3 p-6">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                <span className="ml-3 px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                  {restaurant.category}
                </span>
              </div>
              
              <div className="mb-4">
                <RatingStars rating={restaurant.rating} />
              </div>
              
              <div className="prose prose-red prose-sm max-w-none mb-6">
                <p className="text-gray-700">{restaurant.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화하기
                </button>
                
                <button
                  onClick={() => setIsReservationModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  테이블 예약
                </button>
                
                {restaurant.menuUrl && (
                  <a
                    href={restaurant.menuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    전체 메뉴 보기
                  </a>
                )}
              </div>
              
              {restaurant.businessHours && (
                <BusinessHours hours={restaurant.businessHours} />
              )}
            </div>
            
            <div className="md:col-span-2 p-6">
              <ImageCarousel images={restaurant.images || [restaurant.imageUrl]} />
            </div>
          </div>
        </div>
        
        {restaurant.menu && restaurant.menu.length > 0 && (
          <Menu menu={restaurant.menu} />
        )}
        
        {restaurant.address && (
          <MapSection address={restaurant.address} />
        )}
      </main>
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        businessHours={restaurant.businessHours}
      />
    </div>
  );
};

export default RestaurantDetailPage; 