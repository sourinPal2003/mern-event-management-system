'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';
import MembershipList from './pages/MembershipList';
import EventsList from './pages/EventsList';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Reports from './pages/Reports';
import Transactions from './pages/Transactions';
import Maintenance from './pages/Maintenance';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Membership Routes */}
          <Route
            path="/membership/add"
            element={
              <ProtectedRoute>
                <AddMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/membership/update"
            element={
              <ProtectedRoute>
                <UpdateMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/membership/list"
            element={
              <ProtectedRoute>
                <MembershipList />
              </ProtectedRoute>
            }
          />

          {/* Events Routes */}
          <Route
            path="/events/list"
            element={
              <ProtectedRoute>
                <EventsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/edit/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          {/* Reports Route */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Transactions Route */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* Maintenance Route (Admin only) */}
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
