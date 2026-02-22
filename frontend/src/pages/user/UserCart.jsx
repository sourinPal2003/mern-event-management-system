import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { API_BASE_URL } from '../../services/api.js';

const UserCart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div>
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mb-4 text-sm text-blue-600"
        >
          Back to Dashboard
        </button>

        <h3 className="text-center mt-10 text-lg">
          Your cart is empty
        </h3>
      </div>
    );
  }

  return (
    <div>

      <h2 className="text-xl font-semibold mb-6 text-center">
        Shopping Cart
      </h2>

      <div className="overflow-x-auto border">

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Total Price</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map(item => (
              <tr key={item._id} className="border-b">

                <td className="p-3">
                  {item.image && (
                    <img
                      src={`${API_BASE_URL}/uploads/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover border"
                    />
                  )}
                </td>

                <td className="p-3">{item.name}</td>

                <td className="p-3">₹{item.price}</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="border px-2"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="border px-2"
                    >
                      +
                    </button>

                  </div>
                </td>

                <td className="p-3">
                  ₹{item.price * item.qty}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="border px-3 py-1 text-sm"
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Grand Total Section */}
      <div className="mt-6 border p-4 flex justify-between items-center">

        <div className="font-semibold">
          Grand Total ₹{cartTotal}
        </div>

        <button
          onClick={clearCart}
          className="border px-4 py-1"
        >
          Delete All
        </button>

      </div>

      {/* Checkout Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/user/checkout')}
          className="border px-6 py-2 text-sm"
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
};

export default UserCart;