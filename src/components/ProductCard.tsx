import React from 'react';
import { motion } from 'motion/react';
import { Star, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../AppContext';

interface ProductCardProps {
  product: Product;
  onClick: (slug: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const { cart, updateQuantity } = useAppContext();
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => onClick(product.slug)}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="p-1.5 bg-white/80 backdrop-blur-md rounded-full text-premium-black hover:bg-rose-gold hover:text-white transition-all shadow-sm">
            <Star size={14} />
          </button>
        </div>
        {product.is_trending === 1 && (
          <div className="absolute top-2 left-2 bg-rose-gold text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
            Trending
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="mb-1">
          <h3 className="font-bold text-sm md:text-base leading-tight cursor-pointer hover:text-rose-gold transition-colors line-clamp-1" onClick={() => onClick(product.slug)}>
            {product.name}
          </h3>
        </div>
        <div className="flex items-center text-[10px] text-gray-400 mb-3">
          <div className="flex items-center text-rose-gold mr-1.5">
            <Star size={10} fill="currentColor" />
            <span className="ml-1 font-bold">{product.rating}</span>
          </div>
          <span className="hidden sm:inline">(120)</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base md:text-lg font-black">${product.price}</span>
          
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 bg-gray-200 text-gray-500 text-[10px] md:text-xs font-bold rounded-lg cursor-not-allowed whitespace-nowrap"
            >
              Out of Stock
            </button>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantity - 1); }}
                className="p-1.5 hover:bg-rose-gold hover:text-white transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="px-2 text-xs font-bold min-w-[24px] text-center">{quantity}</span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantity + 1); }}
                className="p-1.5 hover:bg-rose-gold hover:text-white transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="px-3 py-1.5 bg-premium-black text-white text-[10px] md:text-xs font-bold rounded-lg hover:bg-rose-gold transition-all whitespace-nowrap"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
