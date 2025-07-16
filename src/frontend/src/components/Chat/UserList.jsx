import React from 'react';
import { getUserInitials, generateAvatarColor, formatTimestamp } from '../../utils/helpers';

const UserList = ({ 
  users, 
  onUserClick, 
  activeChat, 
  activeChatType, 
  isGroupList = false 
}) => {
  const getItemClass = (item) => {
    const isActive = activeChat && 
      activeChat.id === item.id && 
      ((isGroupList && activeChatType === 'group') || (!isGroupList && activeChatType === 'direct'));
    
    return `user-item ${isActive ? 'active' : ''}`;
  };

  const getStatusText = (item) => {
    if (isGroupList) {
      return `${item.members.length} members`;
    } else {
      return item.isOnline ? 'Online' : `Last seen ${formatTimestamp(item.lastSeen)}`;
    }
  };

  const getAvatarColor = (item) => {
    if (isGroupList) {
      return '#28a745'; // Green for groups
    }
    return generateAvatarColor(item.id);
  };

  const getAvatarIcon = (item) => {
    if (isGroupList) {
      return '👥';
    }
    return getUserInitials(item.name);
  };

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {isGroupList ? '👥' : '👤'}
        </div>
        <p>No {isGroupList ? 'groups' : 'users'} found</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map(item => (
        <div
          key={item.id}
          className={getItemClass(item)}
          onClick={() => onUserClick(item)}
        >
          <div className="user-avatar-container">
            <div
              className="user-avatar"
              style={{ backgroundColor: getAvatarColor(item) }}
            >
              {getAvatarIcon(item)}
            </div>
            {!isGroupList && item.isOnline && (
              <div className="online-indicator"></div>
            )}
          </div>

          <div className="user-info">
            <div className="user-name">{item.name}</div>
            <div className="user-status">
              {getStatusText(item)}
            </div>
            {isGroupList && item.description && (
              <div className="group-description">
                {item.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;