import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserInitials, generateAvatarColor } from '../../utils/helpers';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">🚀 ICP Chat</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div 
              className="user-avatar"
              style={{ backgroundColor: generateAvatarColor(user?.id || '') }}
            >
              {getUserInitials(user?.name || '')}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-status">Online</div>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;