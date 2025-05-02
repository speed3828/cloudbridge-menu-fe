import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// 카테고리 옵션
const CATEGORIES = [
  '관광명소',
  '체험',
  '체험/농장',
  '액티비티',
  '숙박',
  '전시/공연',
  '힐링/휴양',
  '맛집투어',
  '역사탐방',
  '자연명소',
  '축제/행사'
];

// 지역 옵션
const LOCATIONS = [
  '양평읍',
  '강상면',
  '강하면',
  '양서면',
  '옥천면',
  '서종면',
  '단월면',
  '청운면',
  '양동면',
  '지평면',
  '용문면',
  '개군면'
];

/**
 * 새 관광/체험 등록 페이지
 */
const NewTourPage = () => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',           // 상호명
    phone: '',          // 연락처
    title: '',          // 제목
    category: '',       // 카테고리
    price: '',          // 가격
    location: '',       // 지역
    description: '',    // 설명
    duration: '',       // 소요시간
    requirements: '',   // 참여 조건
    included: '',       // 포함 사항
    maxPeople: '',      // 최대 인원
  });
  
  // 가능 시간 관리
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newTime, setNewTime] = useState('');
  
  // 이미지 파일 관리
  const [imageFiles, setImageFiles] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // 폼 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 시간 추가 핸들러
  const handleAddTime = () => {
    if (newTime && !availableTimes.includes(newTime)) {
      setAvailableTimes([...availableTimes, newTime]);
      setNewTime('');
    }
  };
  
  // 시간 제거 핸들러
  const handleRemoveTime = (time) => {
    setAvailableTimes(availableTimes.filter(t => t !== time));
  };
  
  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFiles(files);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // API 연결 코드
      // TODO: API Endpoint 연결
      const payload = {
        ...formData,
        price: formData.price ? parseInt(formData.price, 10) : undefined,
        maxPeople: formData.maxPeople ? parseInt(formData.maxPeople, 10) : undefined,
        availableTimes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // 실제 API 호출
      const response = await fetch('/api/menu/tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('관광/체험 등록에 실패했습니다');
      }
      
      // 성공 시 목록 페이지로 이동
      alert('관광/체험이 등록되었습니다. 관리자 승인 후 게시됩니다.');
      router.push('/tour');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('관광/체험 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>관광/체험 등록 - 양평 여기어때</title>
        <meta name="description" content="양평 여기어때에 관광/체험 등록하기" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-blue-500 text-white">
            <h1 className="text-xl font-bold">관광/체험 등록하기</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 상호명 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                상호명/장소명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="상호명 또는 장소명을 입력해주세요"
              />
            </div>
            
            {/* 연락처 입력 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-0000-0000"
              />
              <p className="mt-1 text-xs text-gray-500">
                하이픈(-)을 포함하여 입력해주세요.
              </p>
            </div>
            
            {/* 제목 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={40}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="관광/체험 제목을 입력해주세요"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/40
              </p>
            </div>
            
            {/* 카테고리 선택 */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 가격 입력 */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                가격 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="숫자만 입력"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">원</span>
                </div>
              </div>
            </div>
            
            {/* 소요시간 입력 */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                소요시간 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 1시간, 30분, 1박2일"
              />
            </div>
            
            {/* 가능 시간 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가능 시간
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  추가
                </button>
              </div>
              
              {availableTimes.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">추가된 시간:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((time) => (
                      <div key={time} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-sm">{time}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(time)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 최대 인원 입력 */}
            <div>
              <label htmlFor="maxPeople" className="block text-sm font-medium text-gray-700 mb-1">
                최대 인원
              </label>
              <input
                type="number"
                id="maxPeople"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="숫자만 입력"
              />
            </div>
            
            {/* 참여 조건 입력 */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                참여 조건
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 12세 이상, 보호자 동반 필수 등"
              />
            </div>
            
            {/* 포함 사항 입력 */}
            <div>
              <label htmlFor="included" className="block text-sm font-medium text-gray-700 mb-1">
                포함 사항
              </label>
              <input
                type="text"
                id="included"
                name="included"
                value={formData.included}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 장비 대여, 보험, 강사비 등"
              />
            </div>
            
            {/* 지역 선택 */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                지역 <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">지역 선택</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 설명 입력 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="관광/체험에 대한 상세 설명을 작성해주세요."
              />
            </div>
            
            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="block w-full">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="sr-only"
                      />
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                        {imageFiles ? `${imageFiles[0].name}` : '이미지 선택하기'}
                      </div>
                    </div>
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  최대 5MB, JPG, PNG 파일만 업로드 가능합니다.
                </p>
              </div>
            </div>
            
            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '등록 중...' : '관광/체험 등록하기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewTourPage; 