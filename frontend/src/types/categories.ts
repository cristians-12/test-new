export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  description?: string | null;
}
