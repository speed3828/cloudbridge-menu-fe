// 이 파일은 TypeScript 오류를 우회하기 위해 JavaScript 문법으로 작성되었습니다.
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 지도 섹션 컴포넌트
const MapSection = ({ location, address }) => {
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
            <p className="text-sm text-gray-500 mt-1">위도: {location.lat}, 경도: {location.lng}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 예약 모달 컴포넌트
const BookingModal = ({ 
  isOpen, 
  onClose, 
  storeId, 
  storeName 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    people: 1,
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
      const response = await fetch(`/api/menu/store/${storeId}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          storeId,
          storeName,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('예약 신청에 실패했습니다.');
      }
      
      alert('예약이 접수되었습니다. 상점 측 확인 후 연락드릴 예정입니다.');
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 시간대 옵션 생성
  const timeOptions = [];
  for (let hour = 9; hour <= 21; hour++) {
    const hourString = hour.toString().padStart(2, '0');
    timeOptions.push(`${hourString}:00`);
    timeOptions.push(`${hourString}:30`);
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-90vh overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">예약하기</h3>
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
                min={new Date().toISOString().split('T')[0]}
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
                <option value="">선택해주세요</option>
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
              메시지
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="기타 요청사항이 있으면 입력해주세요"
            ></textarea>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70"
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
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
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

const StoreDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // 실제 환경에서는 API 엔드포인트로 대체됩니다
        // const response = await fetch(`/api/menu/store/${id}`);
        // const data = await response.json();
        
        // 임시 더미 데이터
        const dummyData = {
          id: id,
          name: '양평 자전거',
          title: '양평 자전거 대여 - 강변 자전거 라이딩',
          price: null,
          phone: '010-1234-5678',
          location: '양평읍',
          category: '스포츠/레저',
          description: '양평 한강변을 따라 자전거를 대여해드립니다. 다양한 코스가 준비되어 있으며, 초보자부터 전문가까지 모두 즐길 수 있습니다. 가족 단위로 오시면 할인 혜택도 제공해 드립니다. 예약 및 문의는 전화 또는 카카오톡으로 부탁드립니다.',
          imageUrl: 'https://via.placeholder.com/600x400',
          images: [
            'https://via.placeholder.com/800x600?text=Bike+1',
            'https://via.placeholder.com/800x600?text=Bike+2',
            'https://via.placeholder.com/800x600?text=Bike+3',
            'https://via.placeholder.com/800x600?text=Shop'
          ],
          address: '경기도 양평군 양평읍 강변로 123',
          mapLocation: { lat: 37.4894, lng: 127.4943 },
          openChatUrl: 'https://open.kakao.com/example',
          openHours: [
            { day: '월-금', hours: '09:00 - 18:00' },
            { day: '토-일', hours: '10:00 - 17:00' }
          ],
          status: 'approved',
          createdAt: '2023-04-15T12:00:00Z'
        };
        
        setStore(dummyData);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handlePhoneClick = () => {
    if (store?.phone) window.location.href = `tel:${store.phone}`;
  };
  
  const handleChatClick = () => {
    if (store?.openChatUrl) window.open(store.openChatUrl, '_blank');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">상점 정보를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-500">요청하신 상점 정보가 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <div className="mt-6">
            <Link href="/store" className="text-orange-500 hover:text-orange-600 font-medium">
              상점 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{store.title} - 양평 당근</title>
        <meta name="description" content={store.description} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/store" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            상점 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-2/3 p-6">
              <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{store.title}</h1>
              </div>
              
              <p className="text-gray-500 mb-4">{store.name} | {store.category} | {store.location}</p>
              
              <div className="prose prose-orange max-w-none mb-6">
                <p>{store.description}</p>
              </div>
              
              {store.openHours && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">영업시간</h3>
                  <ul className="space-y-1">
                    {store.openHours.map((item, index) => (
                      <li key={index} className="text-gray-600">
                        <span className="font-medium">{item.day}:</span> {item.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화하기
                </button>
                
                {store.openChatUrl && (
                  <button
                    onClick={handleChatClick}
                    className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    카카오톡
                  </button>
                )}
                
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  예약하기
                </button>
              </div>
            </div>
            
            <div className="md:w-1/3 p-6">
              <ImageCarousel images={store.images || [store.imageUrl]} />
            </div>
          </div>
        </div>
        
        {store.mapLocation && store.address && (
          <MapSection location={store.mapLocation} address={store.address} />
        )}
      </main>
      
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        storeId={store.id}
        storeName={store.name}
      />
    </div>
  );
};

export default StoreDetailPage; 