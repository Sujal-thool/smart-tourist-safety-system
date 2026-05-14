import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import TouristDashboard from './pages/TouristDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import TouristPlaces from './pages/TouristPlaces';

// Simple Route Protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  
  // If allowedRoles is provided, check if user role matches
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'Police' ? '/police/dashboard' : '/tourist/dashboard'} />;
  }

  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Tourist Routes */}
      <Route path="/onboarding" element={
        <PrivateRoute allowedRoles={['Tourist']}>
          <Onboarding />
        </PrivateRoute>
      } />
      <Route path="/tourist/dashboard" element={
        <PrivateRoute allowedRoles={['Tourist']}>
          <TouristDashboard />
        </PrivateRoute>
      } />
      <Route path="/tourist/places" element={
        <PrivateRoute allowedRoles={['Tourist']}>
          <TouristPlaces />
        </PrivateRoute>
      } />
      
      {/* Common Routes */}
      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />

      {/* Police / Admin Routes */}
      <Route path="/police/dashboard" element={
        <PrivateRoute allowedRoles={['Police', 'Admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
