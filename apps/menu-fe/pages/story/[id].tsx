import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import useStoryDetail from '../../hooks/useStoryDetail';
import useStoryComments, { CommentItem } from '../../hooks/useStoryComments';

// 이미지 캐러셀 컴포넌트
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images.length) return null;

  const goToNext = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative mb-6">
      <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`스토리 이미지 ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
            aria-label="이전 이미지"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
            aria-label="다음 이미지"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 댓글 컴포넌트 Props 타입 정의
interface CommentProps {
  comment: CommentItem;
  key?: string;
}

// 댓글 컴포넌트
const Comment = ({ comment }: CommentProps) => {
  const formattedDate = new Date(comment.created_at).toLocaleString();
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{comment.author_email.split('@')[0]}</div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
      <p className="text-gray-700">{comment.body}</p>
    </div>
  );
};

const StoryDetailPage = () => {
  const router = Router.useRouter();
  const { id } = router.query;
  const { data: story, loading: storyLoading, error: storyError, likeStory } = useStoryDetail(id);
  const { comments, loading: commentsLoading, error: commentsError, addComment } = useStoryComments(id);
  
  const [commentText, setCommentText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // 포매팅된 날짜
  const formattedDate = story ? new Date(story.created_at).toLocaleString() : '';
  
  // 좋아요 핸들러
  const handleLike = async () => {
    await likeStory();
    
    // 토스트 메시지 표시
    if (typeof window !== 'undefined' && 'toast' in window) {
      (window as any).toast('좋아요를 눌렀습니다!');
    }
  };
  
  // 댓글 제출 핸들러
  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await addComment(commentText);
      
      if (success) {
        setCommentText('');
        
        // 토스트 메시지 표시
        if (typeof window !== 'undefined' && 'toast' in window) {
          (window as any).toast('댓글이 등록되었습니다!');
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (storyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (storyError || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">스토리를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-500">요청하신 스토리가 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <div className="mt-6">
            <Link href="/story" className="text-blue-500 hover:text-blue-600 font-medium">
              스토리 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{story.title} - 양평 스토리</title>
        <meta name="description" content={story.body.substring(0, 160)} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/story" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            스토리 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h1>
                <div className="text-sm text-gray-500">
                  <span>{story.author_email.split('@')[0]}</span>
                  <span className="mx-2">·</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
              
              <div className="mt-2 sm:mt-0 flex items-center space-x-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {story.views}
                </span>
                
                <button 
                  onClick={handleLike}
                  className="flex items-center text-pink-500 hover:text-pink-600 focus:outline-none"
                  aria-label="좋아요"
                >
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {story.likes}
                </button>
              </div>
            </div>
            
            {/* 이미지 캐러셀 */}
            {story.images && story.images.length > 0 && (
              <ImageCarousel images={story.images} />
            )}
            
            {/* 본문 */}
            <div className="my-6 text-gray-700 whitespace-pre-wrap">{story.body}</div>
          </div>
        </div>
        
        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              댓글 {comments ? `(${comments.length})` : ''}
            </h2>
            
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="mb-3">
                <textarea
                  value={commentText}
                  onChange={(e: any) => setCommentText(e.target.value)}
                  placeholder="댓글을 작성해주세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center ${
                    isSubmitting || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  댓글 작성
                </button>
              </div>
            </form>
            
            {/* 댓글 목록 */}
            {commentsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-600">댓글을 불러오는 중...</p>
              </div>
            ) : commentsError ? (
              <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
                댓글을 불러오는데 실패했습니다.
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <Comment key={comment.comment_id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetailPage; 