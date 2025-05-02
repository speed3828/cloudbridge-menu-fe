import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

// 폼 데이터 타입
interface FormData {
  title: string;
  body: string;
  images: string[];
}

const NewStoryPage = () => {
  const router = Router.useRouter();
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    body: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  // 입력 필드 변경 핸들러
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 핸들러 (실제 구현에서는 이미지 업로드 로직 추가 필요)
  const handleImageUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      // 실제 구현에서는 여기서 이미지를 서버에 업로드하고 URL을 받아와야 함
      // 현재는 임시 URL 생성 (실제 구현에서는 사용하지 않음)
      const imageUrls = Array.from(e.target.files).map(file => 
        URL.createObjectURL(file as Blob)
      );
      
      setFormData((prev: FormData) => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // 유효성 검증
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.body.trim()) {
      setError('본문을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      // 성공 메시지 표시
      if (typeof window !== 'undefined' && 'toast' in window) {
        (window as any).toast('스토리가 등록되었습니다!');
      } else {
        alert('스토리가 등록되었습니다!');
      }
      
      // 등록된 스토리 페이지로 이동
      router.push(`/story/${data.post_id}`);
    } catch (err) {
      console.error('Error submitting story:', err);
      setError((err as Error).message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 미리보기 삭제
  const removeImage = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>새 스토리 작성 - 양평 스토리</title>
        <meta name="description" content="양평 스토리에 새 글을 작성하세요." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/story" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            스토리 목록으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">새 스토리 작성</h1>
            
            {error && (
              <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="body" className="block text-gray-700 font-medium mb-2">
                  본문 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="스토리 내용을 입력하세요"
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  사진
                </label>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`업로드 이미지 ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={`이미지 ${index + 1} 삭제`}
                          aria-label={`이미지 ${index + 1} 삭제`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-gray-500">사진을 추가하려면 클릭하거나 드래그하세요</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/story')}
                  className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStoryPage; 