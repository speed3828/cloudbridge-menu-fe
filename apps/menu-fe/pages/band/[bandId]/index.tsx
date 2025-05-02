import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { Band, Post } from '../../../interfaces/band';

// Custom hooks
const useBandDetail = (bandId: string | undefined) => {
  const [data, setData] = React.useState<Band | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!bandId) return;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/band/${bandId}`);
        if (!response.ok) {
          throw new Error('밴드 정보를 가져오는데 실패했습니다.');
        }
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

const useBandPostList = (bandId: string | undefined) => {
  const [data, setData] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!bandId) return;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/band/${bandId}/post`);
        if (!response.ok) {
          throw new Error('게시글 목록을 가져오는데 실패했습니다.');
        }
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

// Props 타입 정의
interface PostTableRowProps {
  post: Post;
  index: number;
  isEven: boolean;
  key?: string;
}

interface PostCardProps {
  post: Post;
  key?: string;
}

interface SkeletonLoaderProps {
  type: string;
  key?: number | string;
}

// Post table row component
const PostTableRow = ({ post, index, isEven }: PostTableRowProps) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString();
  
  return (
    <tr className={isEven ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
          {post.title}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {post.author}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </span>
        </div>
      </td>
    </tr>
  );
};

// Post card component for mobile view
const PostCard = ({ post }: PostCardProps) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 mb-4">
      <h3 className="font-medium text-blue-600">{post.title}</h3>
      <div className="mt-1 text-xs text-gray-500 flex flex-wrap justify-between">
        <div>
          <span>{post.author}</span>
          <span className="mx-1">•</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views}
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600 line-clamp-2">
        {post.content}
      </div>
    </div>
  );
};

// Loading skeleton component
const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array(5).fill(undefined).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-pulse">
      {Array(3).fill(undefined).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex justify-between mb-2">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/5"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

const BandDetailPage = () => {
  const router = Router.useRouter();
  const { bandId } = router.query;
  const [viewMode, setViewMode] = React.useState('table');
  
  const { data: band, loading: bandLoading, error: bandError } = useBandDetail(bandId as string);
  const { data: posts, loading: postsLoading, error: postsError } = useBandPostList(bandId as string);
  
  const handleNewPost = () => {
    router.push(`/band/${bandId}/new`);
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
  
  if (bandError || !band) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">밴드를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-500">요청하신 밴드가 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <div className="mt-6">
            <Link href="/band" className="text-blue-500 hover:text-blue-600 font-medium">
              밴드 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{band.name} - 양평 밴드</title>
        <meta name="description" content={band.description} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/band" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            밴드 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between">
              <div className="mr-6 mb-4">
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{band.name}</h1>
                  <span className="ml-3 px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {band.category}
                  </span>
                </div>
                
                {band.description && (
                  <p className="text-gray-700 mb-4">{band.description}</p>
                )}
                
                <div className="text-sm text-gray-500">
                  <span>개설일: {new Date(band.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {band.thumbnail && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={band.thumbnail} alt={band.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">게시글</h2>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 mr-4">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded-md ${
                    viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="테이블 보기"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1 rounded-md ${
                    viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="카드 보기"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={handleNewPost}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                글쓰기
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {postsLoading ? (
              <SkeletonLoader type={viewMode === 'table' ? 'table' : 'card'} />
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-500">아직 게시글이 없습니다.</p>
                <button
                  onClick={handleNewPost}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  첫 번째 글 작성하기
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            번호
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            제목
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작성자
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작성일
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            조회/좋아요
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post, index) => (
                          <PostTableRow 
                            key={post.post_id} 
                            post={post} 
                            index={index} 
                            isEven={index % 2 === 0} 
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="sm:hidden">
                    {posts.map(post => (
                      <PostCard key={post.post_id} post={post} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BandDetailPage; 