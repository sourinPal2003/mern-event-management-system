import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const UserGuestList = () => {
  const navigate = useNavigate();

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    relation: ''
  });

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(USER.GUEST_LIST);
      setGuests(data);
    } catch {
      toast.error('Failed to load guest list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(USER.GUEST_BY_ID(editingId), form);
        toast.success('Guest updated');
      } else {
        await API.post(USER.GUEST_LIST, form);
        toast.success('Guest added');
      }

      setForm({ name: '', email: '', phone: '', relation: '' });
      setEditingId(null);
      fetchGuests();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (guest) => {
    setForm({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      relation: guest.relation || ''
    });
    setEditingId(guest._id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(USER.GUEST_BY_ID(id));
      toast.success('Guest removed');
      fetchGuests();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <button
        onClick={() => navigate('/user/dashboard')}
        className="mb-6 text-sm text-purple-600"
      >
        Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Guest List
      </h2>

      {/* Add / Edit Form */}

      <div className="border p-4 mb-6">

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Guest Name"
            required
            className="w-full border px-3 py-2 text-sm"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="relation"
            value={form.relation}
            onChange={handleChange}
            placeholder="Relation"
            className="w-full border px-3 py-2 text-sm"
          />

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-6 py-2 text-sm rounded-md border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition duration-200"
            >
              {editingId ? 'Update Guest' : 'Add Guest'}
            </button>
          </div>

        </form>

      </div>

      {/* Guest Table */}

      {loading ? (
        <Loader text="Loading guest list..." />
      ) : guests.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No guests added yet.
        </p>
      ) : (
        <div className="border overflow-x-auto">

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Relation</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {guests.map((g, i) => (
                <tr key={g._id} className="border-b">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{g.name}</td>
                  <td className="px-4 py-2">{g.email || '-'}</td>
                  <td className="px-4 py-2">{g.phone || '-'}</td>
                  <td className="px-4 py-2">{g.relation || '-'}</td>
                  <td className="px-4 py-2 space-x-2">

                    <button
                      onClick={() => handleEdit(g)}
                      className="border px-3 py-1 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(g._id)}
                      className="border px-3 py-1 text-xs text-red-600"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
};

export default UserGuestList;