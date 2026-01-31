import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  FileText
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">Shiv Furniture</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 flex-1 ml-8">
            <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
              Dashboard
            </NavLink>
            <NavLink to="/invoices" icon={<FileText className="w-4 h-4" />}>
              Invoices
            </NavLink>
          </div>

          {/* Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {getInitials(user?.name)}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle profile menu"
            >
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-[100] border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate" title={user?.email || 'No email'}>
                    {user?.email || 'No email'}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:bg-blue-50 transition-colors duration-150"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:bg-red-50 transition-colors duration-150 text-left"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/invoices" icon={<FileText className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                Invoices
              </MobileNavLink>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'No email'}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-3 text-gray-500" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, children }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, icon, children, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default Navbar;
