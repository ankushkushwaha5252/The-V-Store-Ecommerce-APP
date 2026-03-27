import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-gold font-bold uppercase tracking-widest text-xs"
        >
          Get In Touch
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-6"
        >
          We'd Love to Hear From You
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 max-w-2xl mx-auto"
        >
          Whether you have a question about our products, shipping, or anything else, our team is ready to answer all your questions.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-rose-gold/10 rounded-2xl flex items-center justify-center text-rose-gold flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Phone</h3>
              <p className="text-gray-500 text-sm">Mon-Fri from 9am to 6pm.</p>
              <p className="text-rose-gold font-bold mt-2">+1 (555) 000-1234</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-rose-gold/10 rounded-2xl flex items-center justify-center text-rose-gold flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Email</h3>
              <p className="text-gray-500 text-sm">Our friendly team is here to help.</p>
              <p className="text-rose-gold font-bold mt-2">support@thevstore.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-rose-gold/10 rounded-2xl flex items-center justify-center text-rose-gold flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Office</h3>
              <p className="text-gray-500 text-sm">Come say hello at our office HQ.</p>
              <p className="text-rose-gold font-bold mt-2">123 Luxury Ave, Premium City, PC 54321</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-rose-gold/10 rounded-2xl flex items-center justify-center text-rose-gold flex-shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Working Hours</h3>
              <p className="text-gray-500 text-sm">Our support team is available:</p>
              <p className="text-rose-gold font-bold mt-2">Mon - Sat: 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-premium-black text-white font-bold rounded-full hover:bg-rose-gold transition-all flex items-center justify-center group"
            >
              Send Message <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
