import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.role === 'Tourist') {
        navigate('/tourist/dashboard');
      } else {
        navigate('/police/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center text-slate-800">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to access your security portal
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 pt-2">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-slate-700 text-sm font-semibold ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="you@domain.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="block text-slate-700 text-sm font-semibold">Password</label>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-blue-600/20"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
            <p className="text-center text-slate-500 text-sm">
              New to the system?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
