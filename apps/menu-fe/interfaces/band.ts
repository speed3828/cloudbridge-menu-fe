// 밴드 타입 정의
export interface Band {
  band_id: string;
  name: string;
  category: string;
  description?: string;
  thumbnail?: string;
  created_by: string;
  created_at: string;
}

// 게시물 타입 정의
export interface Post {
  post_id: string;
  band_id: string;
  title: string;
  content: string;
  author: string;
  views: number;
  likes: number;
  created_at: string;
} 