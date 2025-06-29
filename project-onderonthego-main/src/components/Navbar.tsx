import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, admin, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalItems = getTotalItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span>OrderOnTheGo</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link 
                  to="/menu" 
                  className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                    location.pathname === '/menu' ? 'text-orange-500' : ''
                  }`}
                >
                  Menu
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to="/cart" 
                    className="relative text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <div className="flex items-center space-x-3">
                    <Shield className="text-blue-500" size={20} />
                    <span className="text-gray-700 font-medium">{admin?.name}</span>
                    <Link
                      to="/admin"
                      className={`text-gray-700 hover:text-blue-500 transition-colors font-medium ${
                        location.pathname.startsWith('/admin') ? 'text-blue-500' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors ${
                      location.pathname === '/profile' ? 'text-orange-500' : ''
                    }`}
                  >
                    <User size={20} />
                    <span className="font-medium">{user?.name}</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;