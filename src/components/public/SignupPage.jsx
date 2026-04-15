
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { School, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/users/signup`, formData);
      alert('Account created! Please login.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center lg:justify-end bg-cover bg-center px-4 lg:pr-20"
      style={{ backgroundImage: "url('https://as1.ftcdn.net/v2/jpg/03/93/32/30/1000_F_393323046_mo4niGwmjAWqMDMqj5CCqdaQDPit19xd.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/20 lg:hidden" />

      <div className="relative bg-white p-6 md:p-8 rounded-sm shadow-2xl w-full max-w-sm border-t-4 border-red-600">
        <div className="text-center mb-6">
          <div className="inline-flex bg-red-50 p-2 rounded-xl mb-2">
            <School size={32} className="text-[#C83733]" />
          </div>
          <h2 className="text-xs font-bold tracking-widest text-gray-800 uppercase">Play School</h2>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Student Portal</p>
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-4">Create Account</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" required placeholder="Your full name"
                className="w-full pl-9 pr-3 py-2 border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" required placeholder="student@school.com"
                className="w-full pl-9 pr-3 py-2 border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#C83733] text-white py-2.5 font-semibold hover:bg-red-700 transition shadow-md disabled:bg-gray-400 text-sm">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
