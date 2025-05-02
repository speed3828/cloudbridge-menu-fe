/**
 * Interface for store items
 */
export interface Store {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price?: string;
  address?: string;
  phone?: string;
  section?: string;
  category?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
} 