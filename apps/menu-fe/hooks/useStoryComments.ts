import React from 'react';

export interface CommentItem {
  comment_id: string;
  post_id: string;
  body: string;
  author_email: string;
  created_at: string;
}

export const useStoryComments = (id: string | string[] | undefined) => {
  const [comments, setComments] = React.useState<CommentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchComments = React.useCallback(async () => {
    if (!id) return;
    
    const storyId = Array.isArray(id) ? id[0] : id;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/story/${storyId}/comment`);
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }
      const result = await response.json();
      setComments(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성 함수
  const addComment = async (body: string) => {
    if (!id) return;
    
    const storyId = Array.isArray(id) ? id[0] : id;
    
    try {
      const response = await fetch(`/api/story/${storyId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });
      
      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }
      
      // 댓글 목록 새로고침
      await fetchComments();
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  return { comments, loading, error, addComment };
};

export default useStoryComments; 