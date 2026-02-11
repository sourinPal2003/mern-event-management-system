'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MembershipList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get(`${API_URL}/membership/list/all`, { withCredentials: true });
        setMemberships(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch memberships');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Memberships</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/membership/add')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Add Membership
            </button>
            <button
              onClick={() => navigate('/membership/update')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Update Membership
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading memberships...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Membership No.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {memberships.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No memberships found
                    </td>
                  </tr>
                ) : (
                  memberships.map(membership => (
                    <tr key={membership._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{membership.membershipNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{membership.firstName} {membership.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{membership.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{membership.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{membership.duration}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{new Date(membership.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          membership.status === 'active' ? 'bg-green-100 text-green-800' :
                          membership.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {membership.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MembershipList;
