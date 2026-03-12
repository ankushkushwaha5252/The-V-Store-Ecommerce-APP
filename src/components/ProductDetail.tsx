import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { fetchProductBySlug, fetchTrendingProducts } from '../services/api';
import { ProductCard } from './Home';

interface ProductDetailProps {
  slug: string;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug, onAddToCart, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const p = await fetchProductBySlug(slug);
        setProduct(p);
        const r = await fetchTrendingProducts();
        setRelated(r.filter(item => item.slug !== slug).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-gray-50"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 border-transparent hover:border-rose-gold cursor-pointer transition-all">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-60 hover:opacity-100" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-gold uppercase tracking-widest mb-4">
              <span>Premium Collection</span>
              <span>•</span>
              <span>In Stock</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-rose-gold">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={18} fill={i <= Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
                <span className="ml-2 font-bold text-premium-black">{product.rating}</span>
              </div>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-500 text-sm">120 Customer Reviews</span>
            </div>
            <p className="text-3xl font-black text-rose-gold">${product.price}</p>
          </div>

          <div className="mb-10">
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description} Experience the perfect blend of style and functionality. Our products are crafted with the finest materials to ensure durability and elegance.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-50 transition-colors">
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gray-50 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              <button
                onClick={() => {
                  for(let i=0; i<quantity; i++) onAddToCart(product);
                  onNavigate('cart');
                }}
                className="flex-grow py-4 bg-premium-black text-white font-bold rounded-2xl hover:bg-rose-gold transition-all flex items-center justify-center group"
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rose-gold">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Free Shipping</p>
                <p className="text-[10px] text-gray-400">On orders over $500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rose-gold">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">30 Days Return</p>
                <p className="text-[10px] text-gray-400">Hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rose-gold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Secure Payment</p>
                <p className="text-[10px] text-gray-400">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-10">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} onClick={(slug) => onNavigate('product-detail')} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
