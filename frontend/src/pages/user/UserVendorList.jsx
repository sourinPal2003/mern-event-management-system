import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const UserVendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const categories = [
    'All','Catering','Florist','Decoration','Lighting','Others'
  ];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params = filter !== 'All' ? { category: filter } : {};
        const { data } = await API.get(USER.VENDORS, { params });
        setVendors(data);
      } catch {
        toast.error('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  if (loading) return <Loader text="Loading vendors..." />;

  return (
    <div>

      <button
        onClick={() => navigate('/user/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Vendors
      </h2>

      {/* Simple Filter Dropdown */}
      <div className="mb-6">
        <label className="block text-sm mb-1">
          Filter by Category
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 text-sm"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {vendors.length === 0 && (
        <p className="text-center py-10 text-sm text-gray-500">
          No vendors found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {vendors.map(v => (
          <div key={v._id} className="border p-4">

            <h3 className="text-sm font-semibold mb-1">
              {v.name}
            </h3>

            <p className="text-sm mb-1">
              Category: {v.vendorCategory}
            </p>

            <p className="text-sm mb-3">
              Email: {v.email}
            </p>

            <button
              onClick={() => navigate(`/user/shop/${v._id}`)}
              className="w-full border py-2 text-sm"
            >
              Shop Now
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default UserVendorList;