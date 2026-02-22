import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const MaintainVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendState, setExtendState] = useState({});
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ADMIN.VENDORS);
      setVendors(data);
    } catch {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(ADMIN.VENDOR_BY_ID(id));
      toast.success('Vendor deleted');
      fetchVendors();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(ADMIN.CANCEL_MEMBERSHIP(id));
      toast.success('Membership cancelled');
      fetchVendors();
    } catch {
      toast.error('Failed to cancel membership');
    }
  };

  const handleExtend = async (id) => {
    const months = extendState[id]?.months || 3;

    try {
      setExtendState({
        ...extendState,
        [id]: { months, loading: true }
      });

      await API.put(ADMIN.EXTEND_MEMBERSHIP(id), { months });

      toast.success('Membership extended');

      setExtendState({
        ...extendState,
        [id]: { months: 3, loading: false }
      });

      fetchVendors();
    } catch {
      toast.error('Failed to extend membership');

      setExtendState({
        ...extendState,
        [id]: { months: 3, loading: false }
      });
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');

  const isActive = (v) =>
    v.membershipEnd && new Date(v.membershipEnd) > new Date();

  return (
    <div>

      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Manage Vendors
        </h2>

        <Link
          to="/admin/vendors/add"
          className="border px-4 py-2 text-sm"
        >
          Add Vendor
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading vendors..." />
      ) : (
        <div className="border overflow-x-auto">

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b">

                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.email}</td>
                  <td className="p-3">{v.phone || '-'}</td>
                  <td className="p-3">{v.vendorCategory || '-'}</td>
                  <td className="p-3">{fmt(v.membershipStart)}</td>
                  <td className="p-3">{fmt(v.membershipEnd)}</td>
                  <td className="p-3">
                    {isActive(v) ? 'Active' : 'Expired'}
                  </td>

                  <td className="p-3 space-y-2">

                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/vendors/update/${v._id}`)
                        }
                        className="border px-2 py-1"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(v._id)}
                        className="border px-2 py-1"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => handleCancel(v._id)}
                        className="border px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Extend Membership Section */}
                    <div className="space-y-1">

                      <div className="flex gap-3 text-xs">
                        {[3, 6, 12].map((m) => (
                          <label key={m} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`extend-${v._id}`}
                              value={m}
                              checked={
                                (extendState[v._id]?.months || 3) === m
                              }
                              onChange={() =>
                                setExtendState({
                                  ...extendState,
                                  [v._id]: { months: m, loading: false }
                                })
                              }
                            />
                            {m}M
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={() => handleExtend(v._id)}
                        className="border px-2 py-1 text-xs"
                      >
                        {extendState[v._id]?.loading
                          ? 'Extending...'
                          : 'Extend Membership'}
                      </button>

                    </div>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {vendors.length === 0 && (
            <p className="text-center py-6 text-sm text-gray-500">
              No vendors found.
            </p>
          )}

        </div>
      )}

    </div>
  );
};

export default MaintainVendor;