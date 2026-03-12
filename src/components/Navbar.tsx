import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = ({ onNavigate, onSearch }: { onNavigate: (page: string) => void, onSearch: (query: string) => void }) => {
  const { user, setUser, cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
    if (value.trim() !== '') {
      onNavigate('categories');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-bold tracking-tighter text-premium-black">
              The<span className="text-rose-gold">V</span>Store
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onNavigate('home')} className="text-sm font-medium hover:text-rose-gold transition-colors">Home</button>
            <button onClick={() => onNavigate('categories')} className="text-sm font-medium hover:text-rose-gold transition-colors">Categories</button>
            <button onClick={() => onNavigate('deals')} className="text-sm font-medium hover:text-rose-gold transition-colors">Deals</button>
            <button onClick={() => onNavigate('contact')} className="text-sm font-medium hover:text-rose-gold transition-colors">Contact</button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button onClick={() => onNavigate('cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User size={20} />
                </button>
                <button onClick={() => { setUser(null); onNavigate('home'); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={() => onNavigate('login')} className="text-sm font-semibold px-4 py-2 bg-premium-black text-white rounded-full hover:bg-rose-gold transition-all">
                Login
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium border-b border-gray-50">Home</button>
              <button onClick={() => { onNavigate('categories'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium border-b border-gray-50">Categories</button>
              <button onClick={() => { onNavigate('deals'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium border-b border-gray-50">Deals</button>
              <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium">Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-full bg-white shadow-2xl z-50 p-4 md:p-8"
            >
              <div className="max-w-4xl mx-auto flex items-center gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search for premium products..."
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    autoFocus
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-gold" size={24} />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-4 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400 hover:text-premium-black"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="max-w-4xl mx-auto mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Headphones', 'Smart Watch', 'Silk Scarf', 'Lamp'].map(term => (
                    <button 
                      key={term}
                      onClick={() => {
                        setSearchValue(term);
                        onSearch(term);
                        onNavigate('categories');
                        setIsSearchOpen(false);
                      }}
                      className="px-4 py-2 bg-gray-50 hover:bg-rose-gold hover:text-white rounded-full text-sm font-medium transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
