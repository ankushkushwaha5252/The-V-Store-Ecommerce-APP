export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: number;
  image: string;
  rating: number;
  is_trending: number;
  is_best_seller: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItem extends Product {
  quantity: number;
}
