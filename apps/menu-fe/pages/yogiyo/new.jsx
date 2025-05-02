import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// 카테고리 옵션
const CATEGORIES = [
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

/**
 * 식당 등록 페이지
 */
const NewYogiyoPage = () => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',           // 상호명
    phone: '',          // 연락처
    category: '',       // 카테고리
    description: '',    // 설명 (선택사항)
  });
  
  // 이미지 파일 관리
  const [imageFile, setImageFile] = useState(null);
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
  
  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: 실제 API 구현 (Google Sheets API)
      // FormData 생성
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // 이미지 추가
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // 상태 정보 추가
      formDataToSend.append('status', 'pending');
      formDataToSend.append('createdAt', new Date().toISOString());
      
      // API 호출
      const response = await fetch('/api/menu/yogiyo', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('식당 등록에 실패했습니다');
      }
      
      // 성공 시 목록 페이지로 이동
      alert('식당이 등록되었습니다. 관리자 승인 후 게시됩니다.');
      router.push('/yogiyo');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('식당 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>식당 등록 - 양평 요기요</title>
        <meta name="description" content="양평 요기요에 식당/카페 등록하기" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-red-600 text-white">
            <h1 className="text-xl font-bold">식당/카페 등록하기</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 상호명 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                상호명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="식당/카페 이름을 입력해주세요"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="010-0000-0000"
              />
              <p className="mt-1 text-xs text-gray-500">
                하이픈(-)을 포함하여 입력해주세요.
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">카테고리를 선택해주세요</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* 설명 입력 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                식당 소개 (선택사항)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="식당/카페에 대한 간략한 소개를 입력해주세요"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500
              </p>
            </div>
            
            {/* 사진 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대표 사진 <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-contain mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-700"
                      >
                        <span>사진 업로드</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">혹은 드래그 앤 드롭으로 파일을 추가하세요</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF 파일만 업로드 가능합니다
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 제출 버튼 */}
            <div className="pt-4">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/yogiyo')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewYogiyoPage; 