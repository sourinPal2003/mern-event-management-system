import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const MaintainUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ADMIN.USERS);
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(ADMIN.USER_BY_ID(id));
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

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
          Manage Users
        </h2>

        <Link
          to="/admin/users/add"
          className="border px-4 py-2 text-sm"
        >
          Add User
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading users..." />
      ) : (
        <div className="border overflow-x-auto">

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">

                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || '-'}</td>
                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/users/update/${u._id}`)
                      }
                      className="border px-2 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u._id)}
                      className="border px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center py-6 text-sm text-gray-500">
              No users found.
            </p>
          )}

        </div>
      )}

    </div>
  );
};

export default MaintainUser;