import React from 'react';
import { StoryItem } from './useStoryPopular';

export const useStoryLatest = () => {
  const [data, setData] = React.useState<StoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/story?sort=latest');
        if (!response.ok) {
          throw new Error('최신 스토리를 불러오는데 실패했습니다.');
        }
        const result = await response.json();
        
        // JSON 문자열로 저장된 이미지 배열을 파싱
        const parsedResult = result.map((item: any) => ({
          ...item,
          images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        }));
        
        setData(parsedResult);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useStoryLatest; 