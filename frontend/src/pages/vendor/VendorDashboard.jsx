import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(VENDOR.DASHBOARD);
        setStats(data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div>

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.name || 'Vendor'}
        </h1>
        <p className="text-sm text-gray-600">
          Vendor Dashboard Overview
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border p-4">
          <h3 className="text-lg font-semibold">{stats.totalProducts}</h3>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>

        <div className="border p-4">
          <h3 className="text-lg font-semibold">{stats.totalOrders}</h3>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>

        <div className="border p-4">
          <h3 className="text-lg font-semibold">
            ₹{stats.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Revenue</p>
        </div>
      </div>

      {/* Quick Actions */}
<div className="border p-5">
  <h2 className="text-lg font-semibold mb-4">
    Quick Actions
  </h2>

  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => navigate('/vendor/your-items')}
      className="border px-4 py-2 text-sm"
    >
      Your Items
    </button>

    <button
      onClick={() => navigate('/vendor/add-item')}
      className="border px-4 py-2 text-sm"
    >
      Add New Item
    </button>

    <button
      onClick={() => navigate('/vendor/transactions')}
      className="border px-4 py-2 text-sm"
    >
      Transactions
    </button>

    <button
      onClick={() => navigate('/vendor/product-status')}
      className="border px-4 py-2 text-sm"
    >
      Product Status
    </button>

    <button
      onClick={() => navigate('/vendor/request-item')}
      className="border px-4 py-2 text-sm"
    >
      Request Item
    </button>

  </div>
</div>

    </div>
  );
};

export default VendorDashboard;