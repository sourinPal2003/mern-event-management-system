import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FiShoppingCart, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  if (!user) return null;

  const confirmLogout = () => {
    const role = user?.role;
    setOpen(false);
    logout();
    navigate(role === 'vendor' ? '/vendor/login' : role === 'user' ? '/user/login' : '/admin/login');
  };

  const getDashboardPath = () => (!user ? '/' : `/${user.role}/dashboard`);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const linkClass = (path) =>
    `px-3 py-2 rounded text-sm ${
      isActive(path)
        ? 'bg-gray-200 text-black'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="fixed top-0 inset-x-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2"
        >
          {open ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-3">
          <Link to={getDashboardPath()} className={linkClass(getDashboardPath())}>
            Dashboard
          </Link>

          {user.role === 'admin' && (
            <>
              <Link to="/admin/vendors" className={linkClass('/admin/vendors')}>Vendors</Link>
              <Link to="/admin/users" className={linkClass('/admin/users')}>Users</Link>
            </>
          )}

          {user.role === 'vendor' && (
            <>
              <Link to="/vendor/your-items" className={linkClass('/vendor/your-items')}>Your Items</Link>
              <Link to="/vendor/add-item" className={linkClass('/vendor/add-item')}>Add Item</Link>
              <Link to="/vendor/transactions" className={linkClass('/vendor/transactions')}>Transactions</Link>
              <Link to="/vendor/product-status" className={linkClass('/vendor/product-status')}>Status</Link>
            </>
          )}

          {user.role === 'user' && (
            <>
              <Link to="/user/vendors" className={linkClass('/user/vendors')}>Vendors</Link>
              <Link to="/user/orders" className={linkClass('/user/orders')}>Orders</Link>
              <Link to="/user/guest-list" className={linkClass('/user/guest-list')}>Guests</Link>
              <Link to="/user/cart" className={`relative ${linkClass('/user/cart')}`}>
                <FiShoppingCart size={14} />
                {cartItems.length > 0 && (
                  <span className="ml-1 text-xs text-red-600">
                    ({cartItems.length})
                  </span>
                )}
              </Link>
            </>
          )}
        </div>

        {/* User + Logout */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="text-gray-600 capitalize">
            {user.name} ({user.role})
          </span>
          <button
            onClick={confirmLogout}
            className="text-red-600 hover:underline flex items-center gap-1"
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-2 bg-white">
          <Link to={getDashboardPath()} onClick={() => setOpen(false)} className={linkClass(getDashboardPath())}>
            Dashboard
          </Link>

          {user.role === 'admin' && (
            <>
              <Link to="/admin/vendors" onClick={() => setOpen(false)} className={linkClass('/admin/vendors')}>Vendors</Link>
              <Link to="/admin/users" onClick={() => setOpen(false)} className={linkClass('/admin/users')}>Users</Link>
            </>
          )}

          {user.role === 'vendor' && (
            <>
              <Link to="/vendor/your-items" onClick={() => setOpen(false)} className={linkClass('/vendor/your-items')}>Your Items</Link>
              <Link to="/vendor/add-item" onClick={() => setOpen(false)} className={linkClass('/vendor/add-item')}>Add Item</Link>
              <Link to="/vendor/transactions" onClick={() => setOpen(false)} className={linkClass('/vendor/transactions')}>Transactions</Link>
              <Link to="/vendor/product-status" onClick={() => setOpen(false)} className={linkClass('/vendor/product-status')}>Status</Link>
            </>
          )}

          {user.role === 'user' && (
            <>
              <Link to="/user/vendors" onClick={() => setOpen(false)} className={linkClass('/user/vendors')}>Vendors</Link>
              <Link to="/user/orders" onClick={() => setOpen(false)} className={linkClass('/user/orders')}>Orders</Link>
              <Link to="/user/guest-list" onClick={() => setOpen(false)} className={linkClass('/user/guest-list')}>Guests</Link>
              <Link to="/user/cart" onClick={() => setOpen(false)} className={linkClass('/user/cart')}>
                Cart ({cartItems.length})
              </Link>
            </>
          )}

          <div className="pt-3 border-t">
            <button
              onClick={confirmLogout}
              className="text-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;