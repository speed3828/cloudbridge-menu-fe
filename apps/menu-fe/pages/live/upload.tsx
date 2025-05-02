import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface FormData {
  title: string;
  body: string;
  image_url: string;
}

const UploadPage = () => {
  const router = Router.useRouter();
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    body: '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.body.trim()) {
      setError('내용을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/live/upload', {
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
      
      // Show toast message
      if (typeof window !== 'undefined' && 'toast' in window) {
        (window as any).toast('제보가 등록되었습니다!');
      } else {
        alert('제보가 등록되었습니다!');
      }
      
      // Redirect to the live page
      router.push('/live');
    } catch (err) {
      console.error('Error uploading post:', err);
      setError((err as Error).message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>제보하기 - 양평 LIVE</title>
        <meta name="description" content="양평 지역의 소식을 제보해주세요." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/live" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            양평 LIVE로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">소식 제보하기</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  required
                  value={formData.body}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="내용을 상세히 입력해주세요"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이미지 URL을 입력하세요 (선택사항)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  이미지가 있다면 URL을 입력해주세요. 나중에 업로드 기능으로 개선 예정입니다.
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "등록 중..." : "제보하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 