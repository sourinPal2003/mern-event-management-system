'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('memberships');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        if (activeTab === 'memberships') {
          response = await axios.get(`${API_URL}/reports/memberships`, { withCredentials: true });
        } else if (activeTab === 'events') {
          response = await axios.get(`${API_URL}/reports/events`, { withCredentials: true });
        } else if (activeTab === 'financial' && user.role === 'admin') {
          response = await axios.get(`${API_URL}/reports/financial`, { withCredentials: true });
        }

        if (!response) {
          setData(null);
          setError('');
        } else {
          setData(response.data);
          setError('');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user.role]);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow border-b flex">
          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-6 py-3 font-medium ${activeTab === 'memberships' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Membership Report
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-medium ${activeTab === 'events' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Events Report
          </button>
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('financial')}
              className={`px-6 py-3 font-medium ${activeTab === 'financial' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
            >
              Financial Report
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading report...</p>
            </div>
          ) : data ? (
            <>
              {/* Membership Report */}
              {activeTab === 'memberships' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Membership Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="text-3xl font-bold text-blue-600">{data.total}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-3xl font-bold text-green-600">{data.active}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Expired</p>
                      <p className="text-3xl font-bold text-red-600">{data.expired}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Cancelled</p>
                      <p className="text-3xl font-bold text-gray-600">{data.cancelled}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Member No.</th>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Duration</th>
                          <th className="px-4 py-2 text-left">Expiry</th>
                          <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map(m => (
                          <tr key={m._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{m.membershipNumber}</td>
                            <td className="px-4 py-2">{m.firstName} {m.lastName}</td>
                            <td className="px-4 py-2">{m.duration}</td>
                            <td className="px-4 py-2">{new Date(m.endDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                m.status === 'active' ? 'bg-green-100 text-green-800' :
                                m.status === 'expired' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Events Report */}
              {activeTab === 'events' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Events Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Events</p>
                      <p className="text-3xl font-bold text-blue-600">{data.total}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-3xl font-bold text-purple-600">{data.upcoming}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{data.completed}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Registrations</p>
                      <p className="text-3xl font-bold text-orange-600">{data.totalRegistrations}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Event Name</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Location</th>
                          <th className="px-4 py-2 text-left">Registrations</th>
                          <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map(e => (
                          <tr key={e._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{e.eventName}</td>
                            <td className="px-4 py-2">{new Date(e.eventDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{e.location}</td>
                            <td className="px-4 py-2">{e.registrations}/{e.capacity}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                e.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                e.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Report */}
              {activeTab === 'financial' && data && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">₹{data.totalRevenue ?? 0}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-3xl font-bold text-blue-600">{data.totalTransactions ?? 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-purple-600">{data.byStatus?.completed ?? 0}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">By Type</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Membership:</span><strong>{data.byType?.membership ?? 0}</strong></div>
                        <div className="flex justify-between"><span>Event:</span><strong>{data.byType?.event ?? 0}</strong></div>
                        <div className="flex justify-between"><span>Other:</span><strong>{data.byType?.other ?? 0}</strong></div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">By Payment Method</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Cash:</span><strong>{data.byPaymentMethod?.cash ?? 0}</strong></div>
                        <div className="flex justify-between"><span>Card:</span><strong>{data.byPaymentMethod?.card ?? 0}</strong></div>
                        <div className="flex justify-between"><span>Online:</span><strong>{data.byPaymentMethod?.online ?? 0}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Reports;
