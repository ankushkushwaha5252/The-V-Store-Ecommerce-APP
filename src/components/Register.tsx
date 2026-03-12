import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

const Register = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onNavigate('login');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-500">Join TheVStore for a premium shopping experience</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                placeholder="name@example.com"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                placeholder="+1 (555) 000-0000"
                required
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all flex items-center justify-center group disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-bold text-rose-gold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
