import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const UpdateUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(ADMIN.USER_BY_ID(id));
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone || ''
        });
      } catch {
        toast.error('Failed to load user');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.put(ADMIN.USER_BY_ID(id), form);
      toast.success('User updated');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading user..." />;

  return (
    <div className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/admin/users')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Users
      </button>

      <div className="border p-6 bg-white">

        <h2 className="text-xl font-semibold mb-6">
          Update User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 text-sm"
          >
            {submitting ? 'Saving...' : 'Update User'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UpdateUserAdmin;