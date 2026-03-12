import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, MapPin } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Address } from '../types';

interface CartProps {
  onCheckout: (address: Address) => void;
  addresses: Address[];
  onNavigate: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout, addresses, onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, user } = useAppContext();
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(addresses[0] || null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 20;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-8 py-3 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-rose-gold font-bold mb-3">${item.price}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-black text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}

          {/* Address Selection */}
          {user && (
            <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <MapPin className="mr-2 text-rose-gold" size={20} />
                  Delivery Address
                </h2>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-sm font-bold text-rose-gold hover:underline"
                >
                  Manage Addresses
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress?.id === addr.id
                          ? 'border-rose-gold bg-rose-gold/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold mb-1">{addr.full_name}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs font-medium mt-2">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No addresses saved yet.</p>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-2 border border-rose-gold text-rose-gold font-bold rounded-full hover:bg-rose-gold hover:text-white transition-all"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-premium-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-premium-black">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-rose-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-4 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all mb-4"
              >
                Login to Checkout
              </button>
            ) : (
              <button
                disabled={!selectedAddress}
                onClick={() => selectedAddress && onCheckout(selectedAddress)}
                className={`w-full py-4 font-bold rounded-full transition-all flex items-center justify-center group ${
                  selectedAddress
                    ? 'bg-premium-black text-white hover:bg-rose-gold'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Checkout via WhatsApp <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            )}

            <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-bold">
              Secure Checkout Powered by WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
