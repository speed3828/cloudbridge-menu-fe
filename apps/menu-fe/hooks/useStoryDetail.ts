import React from 'react';
import { StoryItem } from './useStoryPopular';

export const useStoryDetail = (id: string | string[] | undefined) => {
  const [data, setData] = React.useState<StoryItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    
    const storyId = Array.isArray(id) ? id[0] : id;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/story/${storyId}`);
        if (!response.ok) {
          throw new Error('스토리 상세 정보를 불러오는데 실패했습니다.');
        }
        const result = await response.json();
        
        // JSON 문자열로 저장된 이미지 배열을 파싱
        const parsedResult = {
          ...result,
          images: typeof result.images === 'string' ? JSON.parse(result.images) : result.images
        };
        
        setData(parsedResult);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 좋아요 함수
  const likeStory = async () => {
    if (!data) return;
    
    try {
      const storyId = Array.isArray(id) ? id[0] : id;
      const response = await fetch(`/api/story/${storyId}/like`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }
      
      const result = await response.json();
      setData((prev: StoryItem | null) => prev ? {...prev, likes: result.likes} : null);
      return result.likes;
    } catch (err) {
      console.error('Error liking story:', err);
      return null;
    }
  };

  return { data, loading, error, likeStory };
};

export default useStoryDetail; 