import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useLiveFeed, { LiveItem } from '../../hooks/useLiveFeed';

interface PostCardProps {
  item: LiveItem;
  key?: string;
}

// Post card component
const PostCard = ({ item }: PostCardProps) => {
  const isNews = 'live_id' in item;
  const id = isNews ? item.live_id : item.post_id;
  const time = isNews ? item.publish_time : item.created_at;
  const formattedDate = new Date(time || '').toLocaleString();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start">
        {item.image_url && (
          <div className="w-20 h-20 mr-4 rounded overflow-hidden flex-shrink-0">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-medium text-lg">{item.title}</h3>
          
          <div className="text-sm text-gray-500 mt-1 mb-2 flex items-center">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
              isNews ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {isNews ? item.source : '주민제보'}
            </span>
            <span>{formattedDate}</span>
          </div>
          
          <p className="text-gray-700 line-clamp-2">{item.body}</p>
          
          {isNews && item.source_url && (
            <a 
              href={item.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm inline-flex items-center mt-2"
            >
              원문 보기
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const LiveFeedPage = () => {
  const { data, loading, error } = useLiveFeed();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>양평 LIVE - 실시간 소식</title>
        <meta name="description" content="양평 지역의 실시간 뉴스와 소식을 확인하세요" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">양평 LIVE</h1>
          <Link href="/live/upload" passHref>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-colors flex items-center"
              aria-label="제보하기"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              제보하기
            </button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M9 15L4 10m0 0l5-5m-5 5h12" />
            </svg>
            <p className="mt-4 text-gray-500">아직 등록된 소식이 없습니다</p>
          </div>
        ) : (
          <div>
            {data.map((item) => (
              <PostCard key={item.live_id || item.post_id} item={item} />
            ))}
          </div>
        )}
      </main>
      
      {/* FAB for mobile */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link href="/live/upload" passHref>
          <button 
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center"
            aria-label="제보하기"
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

export default LiveFeedPage; 