import React from 'react';

export interface LiveItem {
  live_id?: string;
  post_id?: string;
  title: string;
  body: string;
  image_url?: string;
  source?: string;
  source_url?: string;
  author?: string;
  publish_time?: string;
  created_at: string;
}

export const useLiveFeed = () => {
  const [data, setData] = React.useState<LiveItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/live');
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        const result = await response.json();
        setData(result);
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

export default useLiveFeed; 