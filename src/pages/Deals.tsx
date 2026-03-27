import React from 'react';
import { motion } from 'motion/react';
import { Tag, Zap, Clock, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Deals = () => {
  const { products, addToCart } = useAppContext();
  const navigate = useNavigate();
  
  // Filter products that might be on "sale" (for demo, we'll just take a few)
  const dealProducts = products.slice(0, 3);

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-rose-gold/10 text-rose-gold font-bold text-xs uppercase tracking-widest mb-6"
        >
          <Zap size={14} className="mr-2" /> Flash Sale is Live
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Exclusive Deals & Offers</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Don't miss out on our limited-time offers. Premium quality at prices you'll love.
        </p>
      </div>

      {/* Featured Offer Card */}
      <div className="mb-20">
        <div className="relative rounded-[2.5rem] overflow-hidden premium-gradient p-10 md:p-20 text-white">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Weekend Special: <br /> <span className="text-rose-gold-light">40% OFF</span> on Accessories</h2>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">08</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Hours</span>
                </div>
                <span className="text-2xl opacity-30">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">45</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Mins</span>
                </div>
                <span className="text-2xl opacity-30">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">12</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Secs</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/categories')}
                className="px-10 py-4 bg-white text-premium-black font-bold rounded-full hover:bg-rose-gold hover:text-white transition-all flex items-center group"
              >
                Shop the Sale <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" 
                alt="Deal" 
                className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-gold/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full"></div>
        </div>
      </div>

      {/* Deal Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Limited Time Offers</h2>
          <div className="flex items-center text-rose-gold font-bold text-sm">
            <Clock size={16} className="mr-2" /> Ending Soon
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {dealProducts.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                Save 20%
              </div>
              <ProductCard product={product} onClick={handleProductClick} onAddToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter / Coupon Section */}
      <div className="mt-20 bg-gray-50 rounded-[2.5rem] p-10 md:p-16 text-center border border-gray-100">
        <Tag className="mx-auto text-rose-gold mb-6" size={40} />
        <h2 className="text-3xl font-bold mb-4">Get Instant Coupons</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">Subscribe to our newsletter and receive exclusive discount codes directly in your inbox every week.</p>
        <div className="max-w-md mx-auto flex gap-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-6 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
          />
          <button className="px-8 py-4 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deals;
