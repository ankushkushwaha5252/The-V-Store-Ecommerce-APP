import React from 'react';
import Navbar from './Navbar';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const Footer = () => (
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
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/categories" className="hover:text-white transition-colors">Categories</a></li>
            <li><a href="/deals" className="hover:text-white transition-colors">Deals</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
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

export default Layout;
