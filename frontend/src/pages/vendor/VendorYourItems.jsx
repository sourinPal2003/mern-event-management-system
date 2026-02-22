import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const VendorYourItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    status: 'Available'
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(VENDOR.PRODUCTS);
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(VENDOR.PRODUCT_BY_ID(id));
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      status: product.status
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(VENDOR.PRODUCT_BY_ID(id), editForm);
      toast.success('Product updated');
      setEditingId(null);
      fetchProducts();
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <Loader text="Loading your items..." />;

  return (
    <div className="max-w-6xl mx-auto">

      <button
        onClick={() => navigate('/vendor/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Items</h2>

        <button
          onClick={() => navigate('/vendor/add-item')}
          className="px-4 py-2 bg-black text-white text-sm"
        >
          Add Item
        </button>
      </div>

      {products.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No products yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {products.map((p) => (
          <div key={p._id} className="border p-4 bg-white">

            {p.image && (
              <img
  src={`${API_BASE_URL}/uploads/${p.image}`}
  alt={p.name}
  className="w-full h-52 object-contain border mb-3 bg-gray-100"
/>
            )}

            {editingId === p._id ? (
              <>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full border px-2 py-1 text-sm mb-2"
                />

                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="w-full border px-2 py-1 text-sm mb-2"
                />

                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full border px-2 py-1 text-sm mb-3"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(p._id)}
                    className="flex-1 bg-black text-white py-1 text-sm"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 border py-1 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="text-sm">₹{p.price}</p>
                <p className="text-xs mb-3">{p.status}</p>

                <div className="flex gap-2">

                  <button
                    onClick={() => navigate(`/vendor/view-product/${p._id}`)}
                    className="flex-1 border py-1 text-sm"
                  >
                    View
                  </button>

                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 border py-1 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 border py-1 text-sm text-red-600"
                  >
                    Delete
                  </button>

                </div>
              </>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};

export default VendorYourItems;