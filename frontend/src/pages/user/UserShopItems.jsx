import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { useCart } from '../../context/CartContext.jsx';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const UserShopItems = () => {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(USER.VENDOR_PRODUCTS(vendorId));
        setProducts(data);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  const handleAdd = (product) => {
    addToCart({ ...product, vendorId });
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div>

      <button
        onClick={() => navigate('/user/vendors')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Vendors
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Shop Items
        </h2>

        {cartItems.length > 0 && (
          <button
            onClick={() => navigate('/user/cart')}
            className="border px-4 py-2 text-sm"
          >
            Go to Cart
          </button>
        )}
      </div>

      {products.length === 0 && (
        <p className="text-center py-10 text-sm text-gray-500">
          No products available.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {products.map(p => (
          <div key={p._id} className="border p-4">

            {p.image && (
              <img
                src={`${API_BASE_URL}/uploads/${p.image}`}
                alt={p.name}
                className="w-full h-40 object-cover mb-3 border"
              />
            )}

            <h3 className="text-sm font-semibold mb-1">
              {p.name}
            </h3>

            <p className="text-sm mb-1">
              Price: ₹{p.price}
            </p>

            <p className="text-sm mb-3">
              Status: {p.status}
            </p>

            {p.status === 'Available' && (
              <button
                onClick={() => handleAdd(p)}
                className="w-full border py-2 text-sm"
              >
                Add to Cart
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};

export default UserShopItems;