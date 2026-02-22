import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';

const AddVendor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vendorCategory: 'Caterer',
    membershipMonths: 1
  });

  const [submitting, setSubmitting] = useState(false);

  const categories = [
   'Catering','Florist','Decoration','Lighting','Others'  
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post(ADMIN.VENDORS, form);
      toast.success('Vendor added successfully');
      navigate('/admin/vendors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/admin/vendors')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Vendors
      </button>

      <div className="border p-6 bg-white">

        <h2 className="text-xl font-semibold mb-6">
          Add Vendor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              value={form.vendorCategory}
              onChange={(e) =>
                setForm({ ...form, vendorCategory: e.target.value })
              }
              className="w-full border px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Membership Duration
            </label>
            <select
              value={form.membershipMonths}
              onChange={(e) =>
                setForm({
                  ...form,
                  membershipMonths: Number(e.target.value)
                })
              }
              className="w-full border px-3 py-2 text-sm"
            >
              {[3, 6, 12].map((m) => (
                <option key={m} value={m}>
                  {m} month{m > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 text-sm"
          >
            {submitting ? 'Saving...' : 'Add Vendor'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddVendor;