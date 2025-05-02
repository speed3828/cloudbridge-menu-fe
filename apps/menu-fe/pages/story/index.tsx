import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useStoryPopular, { StoryItem } from '../../hooks/useStoryPopular';
import useStoryLatest from '../../hooks/useStoryLatest';

// 스토리 카드 컴포넌트
interface StoryCardProps {
  story: StoryItem;
}

const StoryCard = ({ story }: StoryCardProps): JSX.Element => {
  const formattedDate = new Date(story.created_at).toLocaleDateString();
  const hasImages = story.images && story.images.length > 0;
  
  return (
    <Link href={`/story/${story.post_id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {hasImages && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={story.images[0]} 
              alt={story.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-medium text-lg mb-2">{story.title}</h3>
          <p className="text-gray-700 line-clamp-2 mb-3">{story.body}</p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{formattedDate}</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {story.likes}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {story.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// 스켈레톤 로더 컴포넌트
const SkeletonLoader = (): JSX.Element => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  </div>
);

// 메인 페이지 컴포넌트
const StoryIndexPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<'popular' | 'latest'>('latest');
  const { data: popularStories, loading: popularLoading } = useStoryPopular();
  const { data: latestStories, loading: latestLoading } = useStoryLatest();
  
  const stories = activeTab === 'popular' ? popularStories : latestStories;
  const isLoading = activeTab === 'popular' ? popularLoading : latestLoading;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 스토리 - 지역 주민들의 이야기</title>
        <meta name="description" content="양평 지역 주민들의 일상과 이야기를 공유하는 공간입니다." />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">양평 스토리</h1>
          <Link href="/story/new" passHref>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-colors flex items-center"
              aria-label="글쓰기"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              글쓰기
            </button>
          </Link>
        </div>
        
        {/* 탭 */}
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
              최신 스토리
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`py-3 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'popular'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              인기 스토리
            </button>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(undefined).map((_, i) => (
                  <div key={i}>
                    <SkeletonLoader />
                  </div>
                ))}
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-4 text-gray-500">아직 등록된 스토리가 없습니다</p>
                <Link href="/story/new" className="mt-2 inline-block text-blue-500 hover:text-blue-600">
                  첫 번째 스토리 작성하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story.post_id}>
                    <StoryCard story={story} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* FAB for mobile */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link href="/story/new" passHref>
          <button 
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center"
            aria-label="글쓰기"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StoryIndexPage; 