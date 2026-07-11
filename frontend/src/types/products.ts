export interface Product {
  id: number;
  name: string;
  image_url: string | null;
  description: string | null;
  price: number;
  category_id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
