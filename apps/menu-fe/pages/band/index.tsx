import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { Band, Post } from '../../interfaces/band';

// Custom hooks for fetching data
const useBandList = () => {
  const [data, setData] = React.useState<Band[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/band');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

const useBandLatest = () => {
  const [data, setData] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/band/global/latest');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

const useBandPopular = () => {
  const [data, setData] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/band/global/popular');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Props 타입 정의
interface BandNavigationProps {
  bands: Band[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface BandCardProps {
  band: Band;
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

// Left side navigation component
const BandNavigation = ({ 
  bands, 
  selectedCategory, 
  onSelectCategory 
}: BandNavigationProps) => {
  const categories = ['전체', '취미', '운동', '문화', '봉사'];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 lg:mb-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">밴드 카테고리</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => onSelectCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category}
                {category !== '전체' && (
                  <span className="ml-1 text-sm text-gray-500">
                    ({bands.filter(band => band.category === category).length})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/band/new"
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 밴드 만들기
        </Link>
      </div>
    </div>
  );
};

// Band card component
const BandCard = ({ band }: BandCardProps) => {
  return (
    <Link href={`/band/${band.band_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:translate-y-[-2px]">
        <div className="h-32 bg-blue-100 relative">
          {band.thumbnail ? (
            <img
              src={band.thumbnail}
              alt={band.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <svg className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900">{band.name}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {band.category}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(band.created_at).toLocaleDateString()}
            </span>
          </div>
          {band.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{band.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Post card component
const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/band/${post.band_id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 hover:shadow-md transition-shadow">
        <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
        <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
          <div>
            <span>{post.author}</span>
            <span className="mx-1">•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
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
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>
      </div>
    </Link>
  );
};

// Loading skeleton component
const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
  if (type === 'band') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-32 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/5"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
    </div>
  );
};

// Main component
const BandIndexPage = () => {
  const router = Router.useRouter();
  const [activeTab, setActiveTab] = React.useState('latest');
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  
  // Fetch data using custom hooks
  const { data: bands, loading: bandsLoading } = useBandList();
  const { data: latestPosts, loading: latestLoading } = useBandLatest();
  const { data: popularPosts, loading: popularLoading } = useBandPopular();
  
  // Filter bands by selected category
  const filteredBands = selectedCategory === '전체'
    ? bands
    : bands.filter(band => band.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 밴드 - 지역 커뮤니티</title>
        <meta name="description" content="양평 지역 주민들의 커뮤니티 공간, 양평 밴드에서 다양한 사람들과 교류하세요." />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">양평 밴드</h1>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Left side navigation */}
          <div className="lg:col-span-1">
            <BandNavigation
              bands={bands}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`py-3 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'latest'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  최신 글
                </button>
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`py-3 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'popular'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  인기 글
                </button>
                <button
                  onClick={() => setActiveTab('bands')}
                  className={`py-3 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'bands'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  밴드 목록
                </button>
              </div>
              
              <div className="p-4">
                {/* Latest posts tab */}
                {activeTab === 'latest' && (
                  <div className="space-y-4">
                    <h2 className="font-bold text-lg mb-4">최신 게시글</h2>
                    {latestLoading ? (
                      <>
                        {Array(5).fill(undefined).map((_, i) => (
                          <SkeletonLoader key={i} type="post" />
                        ))}
                      </>
                    ) : latestPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-4 text-gray-500">게시글이 없습니다.</p>
                        <p className="text-sm text-gray-400">첫 번째 게시글을 작성해 보세요!</p>
                      </div>
                    ) : (
                      <>
                        {latestPosts.map((post) => (
                          <PostCard key={post.post_id} post={post} />
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                {/* Popular posts tab */}
                {activeTab === 'popular' && (
                  <div className="space-y-4">
                    <h2 className="font-bold text-lg mb-4">인기 게시글</h2>
                    {popularLoading ? (
                      <>
                        {Array(5).fill(undefined).map((_, i) => (
                          <SkeletonLoader key={i} type="post" />
                        ))}
                      </>
                    ) : popularPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <p className="mt-4 text-gray-500">인기 게시글이 없습니다.</p>
                        <p className="text-sm text-gray-400">게시글에 좋아요를 눌러 인기글을 만들어보세요!</p>
                      </div>
                    ) : (
                      <>
                        {popularPosts.map((post) => (
                          <PostCard key={post.post_id} post={post} />
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                {/* Bands list tab */}
                {activeTab === 'bands' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-lg">밴드 목록</h2>
                      <div className="text-sm text-gray-500">
                        {selectedCategory === '전체' ? '모든 밴드' : `${selectedCategory} 밴드`}
                      </div>
                    </div>
                    
                    {bandsLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {Array(4).fill(undefined).map((_, i) => (
                          <SkeletonLoader key={i} type="band" />
                        ))}
                      </div>
                    ) : filteredBands.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="mt-4 text-gray-500">밴드가 없습니다.</p>
                        {selectedCategory === '전체' ? (
                          <Link href="/band/new" className="inline-block mt-2 text-blue-500 hover:text-blue-600">
                            새 밴드 만들기
                          </Link>
                        ) : (
                          <p className="text-sm text-gray-400">
                            다른 카테고리를 선택하거나 새 밴드를 만들어보세요.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {filteredBands.map((band) => (
                          <BandCard key={band.band_id} band={band} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BandIndexPage; 