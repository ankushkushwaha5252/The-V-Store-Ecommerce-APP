import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Package, LogOut, Plus, Phone, Home, Building } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Address } from '../types';
import { saveAddress } from '../services/api';

const Dashboard = ({ onNavigate, addresses, onAddressAdded }: { onNavigate: (page: string) => void, addresses: Address[], onAddressAdded: () => void }) => {
  const { user, setUser } = useAppContext();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (!user) {
    onNavigate('login');
    return null;
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAddress({ ...newAddress, userId: user.id });
      setIsAddingAddress(false);
      setNewAddress({ fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
      onAddressAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-6 bg-gray-50 rounded-3xl mb-8">
            <div className="w-16 h-16 bg-rose-gold rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button className="w-full flex items-center space-x-3 px-6 py-4 bg-premium-black text-white rounded-2xl font-bold transition-all">
            <User size={20} />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-100 rounded-2xl font-bold transition-all">
            <Package size={20} />
            <span>Orders</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-100 rounded-2xl font-bold transition-all">
            <MapPin size={20} />
            <span>Addresses</span>
          </button>
          <button
            onClick={() => { setUser(null); onNavigate('home'); }}
            className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-red-50 text-red-500 rounded-2xl font-bold transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-12">
          {/* Profile Section */}
          <section>
            <h1 className="text-3xl font-bold mb-8 tracking-tight">Account Overview</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Full Name</p>
                    <p className="font-bold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email Address</p>
                    <p className="font-bold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                    <p className="font-bold">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-rose-gold/10 text-rose-gold rounded-full flex items-center justify-center mb-4">
                  <Package size={24} />
                </div>
                <h3 className="font-bold mb-1">Order History</h3>
                <p className="text-sm text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <button onClick={() => onNavigate('home')} className="text-sm font-bold text-rose-gold hover:underline">Start Shopping</button>
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Saved Addresses</h2>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-premium-black text-white text-sm font-bold rounded-full hover:bg-rose-gold transition-all"
              >
                <Plus size={16} />
                <span>Add New</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm group relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Home size={20} />
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-bold text-rose-gold hover:underline">Edit</button>
                      <button className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                  <p className="font-bold mb-1">{addr.full_name}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <Phone size={12} className="mr-1" />
                    {addr.phone}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddingAddress(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold mb-8">Add New Address</h2>
            <form onSubmit={handleAddAddress} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Address Line</label>
                <input
                  type="text"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Pincode</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="flex-1 py-4 border border-gray-200 text-gray-500 font-bold rounded-full hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
