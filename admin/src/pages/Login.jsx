import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUsers } from '../utils/dataLoader';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // In a real app, this would validate against a backend
    // For demo purposes, we'll check against users data
    const users = getUsers();
    const user = users.find(u => u.loginId === loginId && u.isActive);

    if (!user) {
      setError('Invalid login ID or user is inactive');
      toast.error('Invalid login ID or user is inactive');
      return;
    }

    // Store user in localStorage (in real app, this would be a token)
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    toast.success('Logged in successfully');
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Shiv Furniture</h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Budget Accounting System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Login ID</label>
            <input
              type="text"
              className="input-field"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your login ID"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <small className="block mt-1.5 text-xs text-gray-500 italic">
              Demo: Use any login ID from users (e.g., admin, finance_mgr)
            </small>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base font-semibold">
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600 mb-3">
            <strong className="text-gray-900">Demo Accounts:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 font-mono">
            <li>admin (Administrator)</li>
            <li>finance_mgr (Finance Manager)</li>
            <li>accountant (Accountant)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
