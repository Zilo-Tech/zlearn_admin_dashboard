// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = () => {
    if (!user) return 'A';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'A';
  };

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, students..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-surface-border rounded-lg bg-surface-muted/30 focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-surface-muted rounded-lg transition-colors duration-150 text-gray-500"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-surface-muted rounded-lg transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-zlearn-primary rounded-lg flex items-center justify-center flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">{getInitials()}</span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500">{user?.role || 'Admin'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-zlearn-lg border border-surface-border py-1 z-20">
                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-surface-muted"
                  >
                    Settings
                  </button>
                  <div className="border-t border-surface-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
