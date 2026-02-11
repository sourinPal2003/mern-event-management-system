'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UpdateMembership = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [durations, setDurations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchError, setSearchError] = useState('');
  const [membership, setMembership] = useState(null);
  const [searchNumber, setSearchNumber] = useState('');
  const [action, setAction] = useState('extend');
  const [durationId, setDurationId] = useState('');

  const API_URL = 'http://localhost:5001/api';

  // Fetch available durations on component mount
  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await axios.get(`${API_URL}/maintenance/durations`, { withCredentials: true });
        setDurations(response.data);
        if (response.data.length > 0) {
          setDurationId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch durations:', err);
      }
    };

    fetchDurations();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchError('');
    setError('');

    if (!searchNumber.trim()) {
      setSearchError('Please enter a membership number');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/membership/get/${searchNumber}`,
        { withCredentials: true }
      );
      setMembership(response.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || 'Membership not found');
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(
        `${API_URL}/membership/update/${searchNumber}`,
        {
          action,
          durationId: action === 'extend' ? durationId : undefined
        },
        { withCredentials: true }
      );

      setSuccess(`Membership ${action === 'cancel' ? 'cancelled' : 'extended'} successfully!`);
      setTimeout(() => navigate('/membership/list'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update membership');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Membership</h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8 pb-8 border-b">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="Enter membership number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
              >
                Search
              </button>
            </div>
            {searchError && (
              <p className="text-red-600 text-sm mt-2">{searchError}</p>
            )}
          </form>

          {/* Membership Details */}
          {membership && (
            <>
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{membership.firstName} {membership.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{membership.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{membership.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className={`font-medium ${membership.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {membership.status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Duration</p>
                    <p className="font-medium">{membership.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expiry Date</p>
                    <p className="font-medium">{new Date(membership.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="extend"
                        checked={action === 'extend'}
                        onChange={(e) => setAction(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Extend Membership</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="cancel"
                        checked={action === 'cancel'}
                        onChange={(e) => setAction(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Cancel Membership</span>
                    </label>
                  </div>
                </div>

                {action === 'extend' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Extend Duration *</label>
                    {durations.length === 0 ? (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        No durations available
                      </div>
                    ) : (
                      <select
                        value={durationId}
                        onChange={(e) => setDurationId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        {durations.map(duration => (
                          <option key={duration._id} value={duration._id}>
                            {duration.durationMonths} {duration.durationMonths === 1 ? 'month' : 'months'} - ₹{duration.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || (action === 'extend' && durations.length === 0)}
                    className={`flex-1 text-white py-2 rounded-lg font-medium transition ${
                      action === 'cancel'
                        ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
                        : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
                    }`}
                  >
                    {loading ? 'Processing...' : action === 'cancel' ? 'Cancel Membership' : 'Extend Membership'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMembership(null);
                      setSearchNumber('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateMembership;
