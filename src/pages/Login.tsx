import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = isAdmin ? await adminLogin(email, password) : await login(email, password);
      
      if (success) {
        navigate(isAdmin ? '/admin' : '/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <LogIn className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'Admin Login' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isAdmin ? 'Access the admin dashboard' : 'Sign in to your account'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  !isAdmin ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                }`}
              >
                <LogIn size={16} />
                User
              </button>
              <button
                type="button"
                onClick={() => setIsAdmin(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
              >
                <Shield size={16} />
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isAdmin
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            {isAdmin ? (
              <div className="text-xs text-gray-500">
                <p><strong>Admin:</strong> admin@orderonthego.com / admin123</p>
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                <p><strong>User:</strong> Any email / password123</p>
                <p className="mt-1">Or create a new account using the sign up form</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;