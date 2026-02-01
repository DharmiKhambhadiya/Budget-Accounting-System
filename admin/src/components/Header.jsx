import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCurrentUser, clearAuth } from '../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get current user using auth utility
  const currentUser = getCurrentUser();

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
    // Use centralized auth utility to clear all auth data
    clearAuth();
    toast.success('Logged out successfully');
    setDropdownOpen(false);
    // Navigate to admin login page
    navigate('/admin/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white shadow-md sticky top-0 z-40 ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {getInitials(currentUser.name)}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-sm font-medium text-gray-700 block">{currentUser.name}</span>
                <span className="text-xs text-gray-500">{currentUser.role || 'Admin'}</span>
              </div>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle profile menu"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-[100] border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate" title={currentUser.email || 'No email'}>
                    {currentUser.email || currentUser.role || 'Admin'}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
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
        </div>
      </div>
    </div>
  );
};

export default Header;
