import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Tourist' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect Tourist to onboarding for Digital ID creation, but Police goes straight to dashboard
      navigate(res.data.role === 'Tourist' ? '/onboarding' : '/police/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <UserPlus size={40} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create an Account</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Join the Smart Tourist Safety system</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-semibold ml-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-semibold ml-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-semibold ml-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-semibold ml-1">Account Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
            >
              <option value="Tourist">Tourist</option>
              <option value="Police">Police Officer</option>
            </select>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-blue-600/20">
              Register Account
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
