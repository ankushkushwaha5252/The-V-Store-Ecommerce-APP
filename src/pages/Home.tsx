import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const Home = () => {
  const { categories, addToCart, trending, bestSellers } = useAppContext();
  const navigate = useNavigate();

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      navigate(`/categories/${slug}`);
    } else {
      navigate('/categories');
    }
  };

  const handleViewAll = (filter: string) => {
    if (filter === 'trending') {
      navigate('/categories?filter=trending');
    } else if (filter === 'best-seller') {
      navigate('/categories?filter=best-seller');
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1920"
            alt="Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-rose-gold text-xs font-bold uppercase tracking-widest mb-6">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              The Future of <br /> <span className="text-rose-gold-light">Electronics</span> is Here.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
              Discover a curated selection of cutting-edge gadgets and premium tech accessories. Innovation meets elegance.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/categories')}
                className="px-8 py-4 bg-white text-premium-black font-bold rounded-full hover:bg-rose-gold hover:text-white transition-all flex items-center group"
              >
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button className="px-8 py-4 border border-white/30 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/10 transition-all">
                View Lookbook
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Explore our diverse range of premium collections.</p>
          </div>
          <button 
            onClick={() => handleCategoryClick(null)}
            className="text-rose-gold font-semibold flex items-center hover:underline"
          >
            View All <ArrowRight className="ml-1" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-bold">Explore Collection</span>
                </div>
              </div>
              <h3 className="text-center font-bold text-lg">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="text-left">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Trending Now</h2>
              <p className="text-gray-500 max-w-xl">The most sought-after pieces of the season, handpicked for you.</p>
            </div>
            <button 
              onClick={() => handleViewAll('trending')}
              className="text-rose-gold font-bold flex items-center hover:underline group"
            >
              View All <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {trending.slice(0, 20).map((product) => (
              <ProductCard key={product.id} product={product} onClick={handleProductClick} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rose-gold-gradient rounded-3xl p-10 md:p-20 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Exclusive Offer</h2>
            <p className="text-xl mb-8 opacity-90">Get up to 30% off on your first purchase. Use code: <span className="font-bold">VSTORE30</span></p>
            <button className="px-8 py-4 bg-premium-black text-white font-bold rounded-full hover:bg-white hover:text-premium-black transition-all">
              Claim Discount
            </button>
          </div>
          <div className="mt-10 md:mt-0 relative z-10">
            <div className="text-8xl font-black opacity-20 select-none">30% OFF</div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
            <p className="text-gray-500 mt-2">Our all-time favorites that never go out of style.</p>
          </div>
          <button 
            onClick={() => handleViewAll('best-seller')}
            className="text-rose-gold font-bold flex items-center hover:underline group"
          >
            View All <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {bestSellers.slice(0, 20).map((product) => (
            <ProductCard key={product.id} product={product} onClick={handleProductClick} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-premium-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">What Our Clients Say</h2>
            <div className="flex justify-center space-x-1 text-rose-gold">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Sarah J.", text: "The noise-cancelling headphones are a game changer. TheVStore has become my go-to for all things tech." },
              { name: "Michael R.", text: "Fast shipping and excellent customer service. My new smartphone arrived in perfect condition and the performance is incredible." },
              { name: "Elena W.", text: "Sleek designs and top-tier performance. I've received so many compliments on my latest smartwatch purchase!" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <p className="text-gray-300 italic mb-6">"{t.text}"</p>
                <p className="font-bold text-rose-gold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
