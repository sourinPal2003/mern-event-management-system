import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { useCart } from '../../context/CartContext.jsx';
import { toast } from 'react-toastify';

const UserCheckout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'Cash'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    setSubmitting(true);

    const orderData = {
      items: cartItems.map(item => ({
        productId: item._id,
        vendorId: item.vendorId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image || ''
      })),
      totalAmount: cartTotal,
      paymentMethod: form.paymentMethod,
      shippingAddress: {
        address: form.address,
        city: form.city,
        pincode: form.pincode
      }
    };

    try {
      await API.post(USER.ORDERS, orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/user/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/user/cart')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Cart
      </button>

      <div className="border p-6 bg-white">

        <h2 className="text-xl font-semibold mb-6">
          Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-sm"
            >
              <option value="Cash">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="border p-4 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 text-sm mt-4"
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UserCheckout;