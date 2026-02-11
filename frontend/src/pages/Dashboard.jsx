'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/reports/dashboard`, { withCredentials: true });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Event Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, <strong>{user.username}</strong></span>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium">{user.role.toUpperCase()}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/membership/list')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Memberships
            </button>
            <button
              onClick={() => navigate('/events/list')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Events
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Reports
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Transactions
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/maintenance')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Maintenance
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading statistics...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Memberships Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Total Members</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.memberships.total}</p>
              <p className="text-sm text-green-600 mt-2">Active: {stats.memberships.active}</p>
            </div>

            {/* Expired Memberships */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Expired Memberships</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.memberships.expired}</p>
            </div>

            {/* Events Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.events.total}</p>
              <p className="text-sm text-purple-600 mt-2">Upcoming: {stats.events.upcoming}</p>
            </div>

            {/* Revenue Card (Admin only) */}
            {user.role === 'admin' && stats.financials && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.financials.totalRevenue}</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/membership/add')}
              className="bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Add New Membership
            </button>
            <button
              onClick={() => navigate('/membership/update')}
              className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Update Membership
            </button>
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/events/create')}
                  className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Create Event
                </button>
                <button
                  onClick={() => navigate('/maintenance')}
                  className="bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition"
                >
                  Add Maintenance
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
