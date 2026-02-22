import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const VendorProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleStatusChange = async (product, checked) => {
    const newStatus = checked ? 'Available' : 'Unavailable';

    try {
      await API.put(
        VENDOR.PRODUCT_BY_ID(product._id),
        { status: newStatus }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, status: newStatus }
            : p
        )
      );

      toast.success(`Status updated`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div className="max-w-5xl mx-auto">

      <button
        onClick={() => navigate('/vendor/dashboard')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Product Status
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="border overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Available</th>
              </tr>
            </thead>

            <tbody>

              {products.map((p) => (
                <tr key={p._id} className="border-b">

                  <td className="px-4 py-2">
                    {p.name}
                  </td>

                  <td className="px-4 py-2">
                    ₹{p.price}
                  </td>

                  <td className="px-4 py-2">

                    <input
                      type="checkbox"
                      checked={p.status === 'Available'}
                      onChange={(e) =>
                        handleStatusChange(p, e.target.checked)
                      }
                    />

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

export default VendorProductStatus;