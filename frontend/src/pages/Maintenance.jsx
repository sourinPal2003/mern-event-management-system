'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Maintenance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    durationMonths: '',
    price: ''
  });

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchDurations();
  }, []);

  const fetchDurations = async () => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/durations`, { withCredentials: true });
      setDurations(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch durations');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.durationMonths || formData.price === '') {
      setError('Duration (in months) and price are required');
      return;
    }

    if (parseInt(formData.durationMonths) <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    if (parseFloat(formData.price) < 0) {
      setError('Price must be non-negative');
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/maintenance/durations/${editingId}`,
          { durationMonths: parseInt(formData.durationMonths), price: parseFloat(formData.price) },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/maintenance/durations`,
          { durationMonths: parseInt(formData.durationMonths), price: parseFloat(formData.price) },
          { withCredentials: true }
        );
      }
      setFormData({ durationMonths: '', price: '' });
      setEditingId(null);
      setShowForm(false);
      await fetchDurations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save duration');
    }
  };

  const handleEdit = (duration) => {
    setFormData({
      durationMonths: duration.durationMonths.toString(),
      price: duration.price.toString()
    });
    setEditingId(duration._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this duration? It will not affect existing memberships.')) return;

    try {
      await axios.delete(`${API_URL}/maintenance/durations/${id}`, { withCredentials: true });
      await fetchDurations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete duration');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ durationMonths: '', price: '' });
    setError('');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only admins can manage membership durations</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:underline font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Event Management System</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Membership Durations</h2>
            <p className="text-gray-600 mt-1">Set available membership durations and their prices</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ durationMonths: '', price: '' });
              setError('');
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            {showForm ? 'Cancel' : 'Add Duration'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Duration' : 'Create New Duration'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (in months) *
                  </label>
                  <input
                    type="number"
                    name="durationMonths"
                    value={formData.durationMonths}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 3, 6, 12"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Update Duration' : 'Create Duration'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading durations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {durations.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">No membership durations found</p>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setFormData({ durationMonths: '', price: '' });
                  }}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Create the first duration
                </button>
              </div>
            ) : (
              durations.map(duration => (
                <div key={duration._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-1">
                      {duration.durationMonths}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {duration.durationMonths === 1 ? 'month' : 'months'}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <p className="text-gray-600 text-sm mb-2">Monthly Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{duration.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-gray-500 text-xs mt-4 mb-4">
                    Created: {new Date(duration.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(duration)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(duration._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Maintenance;
