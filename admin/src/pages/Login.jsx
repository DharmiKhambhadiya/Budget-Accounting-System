import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/dataLoader';
import './Login.css';

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
      return;
    }

    // Store user in localStorage (in real app, this would be a token)
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">Shiv Furniture</h1>
          <p className="login-subtitle">Budget Accounting System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Login ID</label>
            <input
              type="text"
              className="form-input"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your login ID"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <small className="form-hint">
              Demo: Use any login ID from users (e.g., admin, finance_mgr)
            </small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-login">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p className="login-info">
            <strong>Demo Accounts:</strong>
          </p>
          <ul className="demo-accounts">
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
