import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const VendorViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(VENDOR.PRODUCT_BY_ID(id));
        setProduct(data);
      } catch {
        toast.error('Failed to load product');
        navigate('/vendor/your-items');
      }
    })();
  }, [id, navigate]);

  if (!product) return <Loader text="Loading product..." />;

  return (
    <div className="max-w-2xl mx-auto">

      <button
        onClick={() => navigate('/vendor/your-items')}
        className="mb-6 text-sm text-blue-600"
      >
        Back to Items
      </button>

      <div className="border p-6 bg-white">

        {product.image && (
          <div className="border mb-4 bg-gray-100 flex items-center justify-center">
            <img
              src={`${API_BASE_URL}/uploads/${product.image}`}
              alt={product.name}
              className="max-h-80 w-full object-contain"
            />
          </div>
        )}

        <h2 className="text-xl font-semibold mb-2">
          {product.name}
        </h2>

        <p className="text-lg mb-2">
          Price: ₹{product.price}
        </p>

        <p className="text-sm mb-2">
          Status: {product.status}
        </p>

        <p className="text-sm text-gray-500">
          Added: {new Date(product.createdAt).toLocaleDateString()}
        </p>

      </div>

    </div>
  );
};

export default VendorViewProduct;