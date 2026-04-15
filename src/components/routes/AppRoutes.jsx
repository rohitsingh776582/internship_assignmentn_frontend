
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../public/LoginPage';
import Signup from '../public/SignupPage';
import Dashboard from '../TaskDashboard/TaskDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<div className="p-10 text-center text-2xl">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;