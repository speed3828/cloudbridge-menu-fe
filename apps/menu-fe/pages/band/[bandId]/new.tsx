import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Band } from '../../../interfaces/band';

// Custom hook for band details
const useBandDetail = (bandId: string | undefined) => {
  const [data, setData] = React.useState<Band | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!bandId) return;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/band/${bandId}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bandId]);

  return { data, loading, error };
};

interface FormData {
  title: string;
  content: string;
}

const NewPostPage = () => {
  const router = Router.useRouter();
  const { bandId } = router.query;
  
  const { data: band, loading: bandLoading } = useBandDetail(bandId as string);
  
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    content: ''
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
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/band/${bandId}/post`, {
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
        (window as any).toast('게시글 등록!');
      } else {
        alert('게시글이 등록되었습니다!');
      }
      
      // Redirect to the band page
      router.push(`/band/${bandId}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError((err as Error).message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (bandLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>새 게시글 작성 - {band?.name || '양평 밴드'}</title>
        <meta name="description" content="밴드에 새 게시글을 작성하세요" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/band/${bandId}`} className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {band?.name || '밴드'} 페이지로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">새 게시글 작성</h1>
            
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
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={15}
                  required
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="내용을 입력하세요"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  마크다운 문법을 지원합니다. (제목: #, 굵게: **, 기울임: *, 링크: [텍스트](URL))
                </p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Link
                  href={`/band/${bandId}`}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-2"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "등록 중..." : "게시글 등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPostPage; 