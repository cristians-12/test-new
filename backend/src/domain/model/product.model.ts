export interface IProduct {
  id: number;
  name: string;
  image_url: string | null;
  description: string | null;
  price: number;
  category_id: number;
  stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
