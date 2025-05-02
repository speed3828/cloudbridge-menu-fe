import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// 복지 프로그램 대상 그룹 옵션
const TARGET_GROUPS = [
  '어르신',
  '장애인',
  '아동',
  '청년'
];

/**
 * 복지 프로그램 제안 페이지
 */
const NewWelfarePage = () => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',            // 프로그램명
    target_group: '',     // 대상
    phone: '',            // 연락처 (선택)
    address: '',          // 주소 (선택)
    service_type: '',     // 서비스 유형 (선택)
    description: '',      // 설명 (선택)
  });
  
  // 이미지 파일 관리
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
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
  const handleThumbnailChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setThumbnailFile(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // FormData 생성
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      
      // 이미지 추가
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }
      
      // 상태 정보 추가
      formDataToSend.append('status', 'pending');
      formDataToSend.append('created_at', new Date().toISOString());
      
      // API 호출
      const response = await fetch('/api/menu/welfare', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('복지 프로그램 제안 등록에 실패했습니다');
      }
      
      // 성공 시 알림 및 목록 페이지로 이동
      alert('제안이 등록되었습니다!');
      router.push('/welfare');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>복지 프로그램 제안 - 양평 복지</title>
        <meta name="description" content="양평 복지 프로그램 제안하기" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-4 px-6 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">복지 프로그램 제안하기</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 프로그램명 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                프로그램명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로그램명을 입력해주세요"
              />
            </div>
            
            {/* 대상 선택 */}
            <div>
              <label htmlFor="target_group" className="block text-sm font-medium text-gray-700 mb-1">
                대상 <span className="text-red-500">*</span>
              </label>
              <select
                id="target_group"
                name="target_group"
                value={formData.target_group}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">대상을 선택해주세요</option>
                {TARGET_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            {/* 서비스 유형 입력 */}
            <div>
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                서비스 유형
              </label>
              <input
                type="text"
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 교육, 돌봄, 의료지원 등"
              />
            </div>
            
            {/* 연락처 입력 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                연락처
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 010-0000-0000"
              />
              <p className="mt-1 text-xs text-gray-500">
                하이픈(-)을 포함하여 입력해주세요.
              </p>
            </div>
            
            {/* 주소 입력 */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="주소를 입력해주세요"
              />
            </div>
            
            {/* 설명 입력 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                프로그램 설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로그램에 대한 자세한 설명을 입력해주세요"
              ></textarea>
            </div>
            
            {/* 썸네일 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대표 이미지
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {thumbnailPreview ? (
                  <div className="text-center">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-contain mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
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
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="thumbnail"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>이미지 업로드</span>
                        <input
                          id="thumbnail"
                          name="thumbnail"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                      <p className="pl-1">혹은 드래그 앤 드롭으로 추가하기</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 제출 버튼 */}
            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/welfare')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '등록 중...' : '제안하기'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewWelfarePage; 