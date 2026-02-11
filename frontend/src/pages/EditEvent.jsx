 'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    description: '',
    capacity: '',
    status: 'upcoming'
  });

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/get/${id}`, { withCredentials: true });
        const e = res.data;
        setFormData({
          eventName: e.eventName || '',
          eventDate: e.eventDate ? new Date(e.eventDate).toISOString().slice(0,16) : '',
          location: e.location || '',
          description: e.description || '',
          capacity: e.capacity || '',
          status: e.status || 'upcoming'
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.eventName || !formData.eventDate || !formData.location || !formData.description || !formData.capacity) {
      setError('All fields are required');
      return false;
    }
    if (parseInt(formData.capacity) <= 0) {
      setError('Capacity must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = { ...formData };
      await axios.put(`${API_URL}/events/update/${id}`, payload, { withCredentials: true });
      setSuccess('Event updated successfully');
      setTimeout(() => navigate('/events/list'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only admins can edit events</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Event Management System</h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">Back to Dashboard</button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-2 border rounded" required min="1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded" rows="4" required />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => navigate('/events/list')} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEvent;
