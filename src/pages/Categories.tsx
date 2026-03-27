import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { ProductCard } from '../components/ProductCard';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const Categories = () => {
  const { products, categories, addToCart } = useAppContext();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialFilter = searchParams.get('filter');
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(slug || null);
  const [filterBy, setFilterBy] = useState<string | null>(initialFilter);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setSelectedCategory(slug || null);
  }, [slug]);

  useEffect(() => {
    setFilterBy(searchParams.get('filter'));
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filterBy, searchQuery, sortBy, priceRange]);

  const handleProductClick = (productSlug: string) => {
    navigate(`/product/${productSlug}`);
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    if (categorySlug) {
      navigate(`/categories/${categorySlug}${filterBy ? `?filter=${filterBy}` : ''}`);
    } else {
      navigate(`/categories${filterBy ? `?filter=${filterBy}` : ''}`);
    }
  };

  const handleFilterSelect = (filter: string | null) => {
    const baseUrl = selectedCategory ? `/categories/${selectedCategory}` : '/categories';
    if (filter) {
      navigate(`${baseUrl}?filter=${filter}`);
    } else {
      navigate(baseUrl);
    }
  };

  const handleClearFilters = () => {
    setPriceRange(1000);
    setSortBy('popularity');
    navigate('/categories');
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch = !selectedCategory || categories.find(c => c.id === p.category_id)?.slug === selectedCategory;
    const priceMatch = p.price <= priceRange;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const trendingMatch = filterBy === 'trending' ? p.is_trending === 1 : true;
    const bestSellerMatch = filterBy === 'best-seller' ? p.is_best_seller === 1 : true;
    
    return categoryMatch && priceMatch && searchMatch && trendingMatch && bestSellerMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const currentCategoryName = filterBy === 'trending' ? 'Trending Products' : 
                            filterBy === 'best-seller' ? 'Best Sellers' :
                            selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Products';

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{currentCategoryName}</h1>
          <p className="text-gray-500">Showing {filteredProducts.length} results</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 px-6 py-3 pr-12 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-premium-black text-white rounded-xl font-bold text-sm hover:bg-rose-gold transition-all md:hidden">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Collections</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleFilterSelect('trending')}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterBy === 'trending' ? 'bg-rose-gold text-white' : 'hover:bg-gray-100'}`}
              >
                Trending Now
              </button>
              <button
                onClick={() => handleFilterSelect('best-seller')}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterBy === 'best-seller' ? 'bg-rose-gold text-white' : 'hover:bg-gray-100'}`}
              >
                Best Sellers
              </button>
              <div className="h-px bg-gray-100 my-4"></div>
              <button
                onClick={() => { handleCategorySelect(null); handleFilterSelect(null); }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${!selectedCategory && !filterBy ? 'bg-rose-gold text-white' : 'hover:bg-gray-100'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat.slug ? 'bg-rose-gold text-white' : 'hover:bg-gray-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Price Range</h3>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-gold"
            />
            <div className="flex justify-between mt-4 text-sm font-bold">
              <span>$0</span>
              <span className="text-rose-gold">Up to ${priceRange}</span>
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <SlidersHorizontal size={14} />
            <span>Clear All Filters</span>
          </button>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">Our style experts are here to help you find the perfect piece.</p>
            <button className="text-xs font-bold text-rose-gold hover:underline">Chat with us</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={handleProductClick} onAddToCart={addToCart} />
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                        currentPage === i + 1 
                          ? 'bg-rose-gold text-white' 
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <SlidersHorizontal className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              <button
                onClick={handleClearFilters}
                className="mt-6 text-rose-gold font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
