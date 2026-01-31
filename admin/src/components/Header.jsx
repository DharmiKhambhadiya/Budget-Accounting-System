import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="header">
      <div className="header-left">
        <h2 className="header-title">Admin Dashboard</h2>
      </div>
      <div className="header-right">
        <div className="header-user">
          <div className="header-user-info">
            <span className="header-user-name">{currentUser.name}</span>
            <span className="header-user-role">{currentUser.role}</span>
          </div>
          <div className="header-user-avatar">
            {currentUser.name.charAt(0)}
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
