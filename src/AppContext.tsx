import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CartItem, Product, Category, Address } from './types';
import { fetchProducts, fetchCategories, fetchTrendingProducts, fetchBestSellers, fetchUserAddresses } from './services/api';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  products: Product[];
  categories: Category[];
  trending: Product[];
  bestSellers: Product[];
  addresses: Address[];
  fetchAddresses: () => void;
  handleCheckout: (address: Address) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vstore_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchAddresses = useCallback(async () => {
    if (user) {
      const addr = await fetchUserAddresses(user.id);
      setAddresses(addr);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      const [p, c, t, b] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchTrendingProducts(),
        fetchBestSellers()
      ]);
      setProducts(p);
      setCategories(c);
      setTrending(t);
      setBestSellers(b);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    localStorage.setItem('vstore_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vstore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + 1, product.stock);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.stock !== undefined ? Math.min(quantity, item.stock) : quantity;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = (address: Address) => {
    if (!user) return;

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 20;
    const total = subtotal + shipping;

    const productList = cart.map(item => `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

    const message = `*New Order from TheVStore*%0A%0A` +
      `*Customer Details:*%0A` +
      `Name: ${address.full_name}%0A` +
      `Phone: ${address.phone}%0A%0A` +
      `*Delivery Address:*%0A` +
      `${address.address_line}, ${address.city}, ${address.state} - ${address.pincode}%0A%0A` +
      `*Products:*%0A` +
      `${productList}%0A%0A` +
      `*Order Summary:*%0A` +
      `Subtotal: $${subtotal.toFixed(2)}%0A` +
      `Shipping: ${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}%0A` +
      `*Total Price: $${total.toFixed(2)}*%0A%0A` +
      `*Payment Method:* Cash on Delivery (COD)%0A%0A` +
      `Please confirm my order. Thank you!`;

    const whatsappNumber = "919876543210"; // Replace with store owner's number
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    clearCart();
    window.location.href = '/';
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, cart, addToCart, removeFromCart, updateQuantity, clearCart,
      products, categories, trending, bestSellers, addresses, fetchAddresses, handleCheckout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
