import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import { AppProvider, useAppContext } from './AppContext';
import { Product, Category, Address } from './types';
import { fetchProducts, fetchCategories, fetchTrendingProducts, fetchBestSellers, fetchUserAddresses } from './services/api';
import { motion, AnimatePresence } from 'motion/react';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);

  const { user, cart, addToCart, clearCart } = useAppContext();

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
    if (user) {
      fetchUserAddresses(user.id).then(setAddresses);
    }
  }, [user]);

  const handleProductClick = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('categories');
    window.scrollTo(0, 0);
  };

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
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            trending={trending}
            bestSellers={bestSellers}
            categories={categories}
            onProductClick={handleProductClick}
            onCategoryClick={handleCategoryClick}
            onAddToCart={addToCart}
          />
        );
      case 'cart':
        return <Cart onCheckout={handleCheckout} addresses={addresses} onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} addresses={addresses} onAddressAdded={() => user && fetchUserAddresses(user.id).then(setAddresses)} />;
      case 'product-detail':
        return selectedProductSlug ? <ProductDetail slug={selectedProductSlug} onAddToCart={addToCart} onNavigate={setCurrentPage} /> : null;
      case 'categories':
        return <CategoryPage initialCategory={selectedCategorySlug} searchQuery={searchQuery} products={products} categories={categories} onProductClick={handleProductClick} onAddToCart={addToCart} />;
      default:
        return <Home trending={trending} bestSellers={bestSellers} categories={categories} onProductClick={handleProductClick} onCategoryClick={handleCategoryClick} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={setCurrentPage} onSearch={setSearchQuery} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <footer className="bg-premium-black text-white pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <span className="text-2xl font-bold tracking-tighter mb-6 block">
            The<span className="text-rose-gold">V</span>Store
          </span>
          <p className="text-gray-400 text-sm leading-relaxed">
            Redefining premium shopping with a curated collection of high-end products. Quality, elegance, and sophistication in every piece.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-rose-gold">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">Categories</button></li>
            <li><button onClick={() => onNavigate('deals')} className="hover:text-white transition-colors">Deals</button></li>
            <li><button className="hover:text-white transition-colors">Contact Us</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-rose-gold">Policy</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            <li><button className="hover:text-white transition-colors">Shipping Policy</button></li>
            <li><button className="hover:text-white transition-colors">Return Policy</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-rose-gold">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>support@thevstore.com</li>
            <li>+1 (555) 000-1234</li>
            <li>123 Luxury Ave, Premium City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">© 2026 TheVStore. All rights reserved.</p>
        <div className="flex space-x-6 text-gray-400">
          <span className="hover:text-rose-gold cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-rose-gold cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-rose-gold cursor-pointer transition-colors">Facebook</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
