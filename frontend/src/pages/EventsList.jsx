'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [membersList, setMembersList] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/list`, { withCredentials: true });
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`${API_URL}/events/delete/${eventId}`, { withCredentials: true });
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleRegister = async (eventId) => {
    const membershipNumber = window.prompt('Enter your membership number to register:');
    if (!membershipNumber) return;

    try {
      const response = await axios.post(`${API_URL}/events/register/${eventId}`, { membershipNumber }, { withCredentials: true });
      // update local state with the new registration count
      setEvents(prev => prev.map(e => e._id === eventId ? response.data.event : e));
      // Clear any previous errors
      setError('');
      // Show success
      window.alert('✓ Registered successfully for the event!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to register for event';
      setError(errorMsg);
      console.error('Registration error:', err);
      window.alert(`✗ Registration failed: ${errorMsg}`);
    }
  };

  const handleUnregister = async (eventId, membershipNumber) => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) return;

    try {
      const response = await axios.post(`${API_URL}/events/unregister/${eventId}`, { membershipNumber }, { withCredentials: true });
      // update local state with the new registration count
      setEvents(prev => prev.map(e => e._id === eventId ? response.data.event : e));
      // Clear any previous errors
      setError('');
      // Show success
      window.alert('✓ Unregistered successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to unregister';
      setError(errorMsg);
      console.error('Unregistration error:', err);
      window.alert(`✗ Unregistration failed: ${errorMsg}`);
    }
  };

  const handleViewMembers = async (eventId) => {
    setCurrentEventId(eventId);
    setMembersLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events/members/${eventId}`, { withCredentials: true });
      setMembersList(response.data.members);
      setShowMembers(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch members';
      window.alert(`Error: ${errorMsg}`);
    } finally {
      setMembersLoading(false);
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/events/create')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Create Event
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No events found
              </div>
            ) : (
              events.map(event => (
                <div key={event._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.eventName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{event.registrations}/{event.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        event.status === 'upcoming' ? 'text-blue-600' :
                        event.status === 'ongoing' ? 'text-orange-600' :
                        event.status === 'completed' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

	                  {user.role === 'admin' && (
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => navigate(`/events/edit/${event._id}`)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewMembers(event._id)}
                        className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-purple-700 transition"
                      >
                        Members ({event.registrations})
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => handleRegister(event._id)}
                      disabled={event.registrations >= event.capacity}
                      className="w-full bg-indigo-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {event.registrations >= event.capacity ? 'Event Full' : 'Register'}
                    </button>
                    <button
                      onClick={() => {
                        const membershipNumber = window.prompt('Enter your membership number to unregister:');
                        if (membershipNumber) {
                          handleUnregister(event._id, membershipNumber);
                        }
                      }}
                      className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-600 transition"
                    >
                      Unregister
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Registered Members</h2>
              <button
                onClick={() => {
                  setShowMembers(false);
                  setMembersList([]);
                  setCurrentEventId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              {membersLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading members...</p>
                </div>
              ) : membersList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No members registered yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Membership No.</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersList.map((member, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{member.membershipNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{member.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{member.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{member.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(member.registeredAt).toLocaleDateString()} {new Date(member.registeredAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => {
                  setShowMembers(false);
                  setMembersList([]);
                  setCurrentEventId(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
