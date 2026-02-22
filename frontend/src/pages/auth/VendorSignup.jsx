import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const VendorSignup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'vendor',
    vendorCategory: 'Caterer',
    membershipMonths: 1
  });

  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Catering','Florist','Decoration','Lighting','Others'
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full max-w-sm border p-6 bg-white">

        <h2 className="text-xl font-semibold text-center mb-6">
          Vendor Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
              placeholder="vendor@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={4}
              className="w-full border px-3 py-2 text-sm"
              placeholder="Minimum 4 characters"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-sm"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="vendorCategory"
              value={form.vendorCategory}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 text-sm"
          >
            {submitting ? 'Creating...' : 'Create Account'}
          </button>

        </form>

        <div className="text-center mt-4 text-sm">
          <p>
            Already have an account?{' '}
            <Link to="/vendor/login" className="text-blue-600">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default VendorSignup;