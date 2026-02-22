import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const VendorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'vendor' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome Vendor!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full max-w-sm border p-6 bg-white">

        <h2 className="text-xl font-semibold text-center mb-6">
          Vendor Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

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
              className="w-full border px-3 py-2 text-sm"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 text-sm"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <div className="text-center mt-4 text-sm">
          <p>
            Don’t have an account?{' '}
            <Link to="/vendor/signup" className="text-blue-600">
              Sign Up
            </Link>
          </p>

          <p className="mt-2">
            Login as{' '}
            <Link to="/admin/login" className="text-blue-600">
              Admin
            </Link>{' '}
            or{' '}
            <Link to="/user/login" className="text-blue-600">
              User
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default VendorLogin;