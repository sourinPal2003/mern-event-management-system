import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const VendorTransactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statuses = [
    'Ordered',
    'Received',
    'Ready for Shipping',
    'Out For Delivery',
    'Delivered'
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(VENDOR.ORDERS);
      setOrders(data);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(
        VENDOR.ORDER_STATUS(orderId),
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: newStatus }
            : o
        )
      );

      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader text="Loading transactions..." />;

  return (
    <div className="max-w-6xl mx-auto">

      <button
        onClick={() => navigate('/vendor/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Transactions
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No transactions yet.
        </p>
      ) : (
        <div className="border overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2">Order ID</th>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-left px-4 py-2">Items</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Payment</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Date</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((o) => (
                <tr key={o._id} className="border-b">

                  <td className="px-4 py-2">
                    {o._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="px-4 py-2">
                    {o.userId?.name || 'N/A'}
                  </td>

                  <td className="px-4 py-2">
                    {o.items?.length || 0}
                  </td>

                  <td className="px-4 py-2">
                    ₹{o.totalAmount}
                  </td>

                  <td className="px-4 py-2">
                    {o.paymentMethod}
                  </td>

                  <td className="px-4 py-2">

                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o._id, e.target.value)
                      }
                      className="border px-2 py-1 text-xs"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                  </td>

                  <td className="px-4 py-2">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default VendorTransactions;