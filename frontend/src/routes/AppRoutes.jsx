import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Pages - will be created in subsequent stages
// Placeholder for now
function Home() {
  return <div className="p-8">Home Page (Coming Soon)</div>;
}

function Shop() {
  return <div className="p-8">Shop Page (Coming Soon)</div>;
}

function Login() {
  return <div className="p-8">Login Page (Coming Soon)</div>;
}

function Register() {
  return <div className="p-8">Register Page (Coming Soon)</div>;
}

function AdminDashboard() {
  return <div className="p-8">Admin Dashboard (Coming Soon)</div>;
}

function NotFound() {
  return <div className="p-8 text-center">404 - Page Not Found</div>;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
