import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const UserDashboard = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div>

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="text-sm text-gray-600">
          User Dashboard
        </p>
      </div>

      {/* Cart Info */}
      {cartItems.length > 0 && (
        <div className="border p-4 mb-6">
          <h3 className="text-lg font-semibold">
            {cartItems.length}
          </h3>
          <p className="text-sm text-gray-600">
            Items in Cart
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="border p-5">
        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate('/user/vendors')}
            className="border px-4 py-2 text-sm"
          >
            Browse Vendors
          </button>

          <button
            onClick={() => navigate('/user/orders')}
            className="border px-4 py-2 text-sm"
          >
            My Orders
          </button>

          <button
            onClick={() => navigate('/user/guest-list')}
            className="border px-4 py-2 text-sm"
          >
            Guest List
          </button>

          <button
            onClick={() => navigate('/user/cart')}
            className="border px-4 py-2 text-sm"
          >
            My Cart {cartItems.length > 0 && `(${cartItems.length})`}
          </button>

        </div>
      </div>

    </div>
  );
};

export default UserDashboard;