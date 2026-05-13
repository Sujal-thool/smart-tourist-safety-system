import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Tourist') {
        if (!user.hasDigitalId) {
          navigate('/onboarding');
        } else {
          navigate('/tourist/dashboard');
        }
      } else {
        navigate('/police/dashboard');
      }
    } catch (error) {
      alert(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-page-bg p-4 font-sans">
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>
      <div className="floating-circle circle-3"></div>

      <div className="w-full max-w-[420px] glass-box login-box-animate rounded-3xl overflow-hidden">
        
        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center text-white">
          <div className="mx-auto icon-container text-blue-400">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-blue-100/70 text-sm font-medium">
            Sign in to access your security portal
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 pt-2">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input"
                placeholder="you@domain.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="premium-button"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center">
            <p className="text-center text-blue-100/70 text-sm">
              New to the system?{' '}
              <Link to="/register" className="premium-link font-semibold ml-1">
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
