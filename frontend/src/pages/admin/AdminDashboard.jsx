import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.name || 'Admin'}
        </h1>
        <p className="text-sm text-gray-600">
          Admin Dashboard
        </p>
      </div>

      {/* Vendor Management */}
      <div className="border p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Vendor Management
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Add, update and manage vendor memberships
        </p>

        <div className="space-y-2">
          <button
            onClick={() => navigate('/admin/vendors/add')}
            className="w-full border px-4 py-2 text-left"
          >
            Add Vendor
          </button>

          <button
            onClick={() => navigate('/admin/vendors')}
            className="w-full border px-4 py-2 text-left"
          >
            Manage Vendors
          </button>
        </div>
      </div>

      {/* User Management */}
      <div className="border p-5">
        <h2 className="text-lg font-semibold mb-3">
          User Management
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Add and manage platform users
        </p>

        <div className="space-y-2">
          <button
            onClick={() => navigate('/admin/users/add')}
            className="w-full border px-4 py-2 text-left"
          >
            Add User
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="w-full border px-4 py-2 text-left"
          >
            Manage Users
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;