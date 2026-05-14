import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Tourist' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect based on role
      if (res.data.role === 'Admin') {
        navigate('/police/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
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
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Create an Account
          </h2>
          <p className="text-blue-100/70 text-sm font-medium">
            Join the Smart Tourist Safety system
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 pt-2">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="premium-input"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="premium-input"
                placeholder="you@domain.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="premium-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-white/90 text-sm font-semibold ml-1">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="premium-input cursor-pointer appearance-none"
              >
                <option value="Tourist" className="text-slate-800">Tourist</option>
                <option value="Admin" className="text-slate-800">Admin</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="premium-button"
              >
                Register Account
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center">
            <p className="text-center text-blue-100/70 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="premium-link font-semibold ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
