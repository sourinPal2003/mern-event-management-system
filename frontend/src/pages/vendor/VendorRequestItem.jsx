import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorRequestItem = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: '',
    description: '',
    quantity: 1
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success(`Request for "${form.itemName}" submitted`);

    setForm({
      itemName: '',
      description: '',
      quantity: 1
    });
  };

  return (
    <div className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/vendor/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <div className="border p-6 bg-white">

        <h2 className="text-xl font-semibold mb-6">
          Request Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 text-sm"
          >
            Submit Request
          </button>

        </form>

      </div>

    </div>
  );
};

export default VendorRequestItem;