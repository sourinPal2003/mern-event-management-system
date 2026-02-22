import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';

const VendorAddItem = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    status: 'Available'
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('status', form.status);
    if (image) formData.append('image', image);

    try {
      await API.post(VENDOR.PRODUCTS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Product added successfully');
      navigate('/vendor/your-items');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/vendor/your-items')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Your Items
      </button>

      <div className="border p-6 bg-white">

        <h2 className="text-xl font-semibold mb-6">
          Add New Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="1"
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-sm"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-sm"
            />
          </div>

          {preview && (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover border mt-2"
              />
            </div>
          )}

          <div className="flex gap-3 mt-4">

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white py-2 text-sm"
            >
              {submitting ? 'Adding...' : 'Add Product'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/vendor/your-items')}
              className="flex-1 border py-2 text-sm"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default VendorAddItem;