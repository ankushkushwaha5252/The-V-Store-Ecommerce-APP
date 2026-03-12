import { Product, Category, User, Address, CartItem } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products');
  return res.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  return res.json();
};

export const fetchTrendingProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products/trending');
  return res.json();
};

export const fetchBestSellers = async (): Promise<Product[]> => {
  const res = await fetch('/api/products/best-sellers');
  return res.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

export const fetchUserAddresses = async (userId: number): Promise<Address[]> => {
  const res = await fetch(`/api/addresses/${userId}`);
  return res.json();
};

export const saveAddress = async (address: Omit<Address, 'id'>): Promise<{ id: number }> => {
  const res = await fetch('/api/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  });
  return res.json();
};
