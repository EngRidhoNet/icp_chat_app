import React, { useState } from 'react';
import Header from '../Common/Header';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

const ChatContainer = () => {
  const { user } = useAuth();
  const { 
    users, 
    groups, 
    messages, 
    activeChat, 
    activeChatType, 
    loading, 
    error, 
    sendMessage, 
    createGroup, 
    openDirectChat, 
    openGroupChat,
    setError
  } = useChat();

  const [activeTab, setActiveTab] = useState('users');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    selectedMembers: []
  });

  const handleSendMessage = async (content, messageType) => {
    const result = await sendMessage(content, messageType);
    if (!result.success) {
      console.error('Failed to send message:', result.error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) return;

    const result = await createGroup(
      groupForm.name,
      groupForm.description || null,
      groupForm.selectedMembers
    );

    if (result.success) {
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '', selectedMembers: [] });
      setActiveTab('groups');
    }
  };

  const handleMemberToggle = (userId) => {
    setGroupForm(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(userId)
        ? prev.selectedMembers.filter(id => id !== userId)
        : [...prev.selectedMembers, userId]
    }));
  };

  const getChatTitle = () => {
    if (!activeChat) return 'Select a chat';
    
    if (activeChatType === 'direct') {
      return activeChat.name;
    } else if (activeChatType === 'group') {
      return `${activeChat.name} (${activeChat.members.length} members)`;
    }
    
    return 'Chat';
  };

  return (
    <div className="chat-container">
      <Header />
      
      <div className="chat-main">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-tabs">
              <button
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button
                className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
                onClick={() => setActiveTab('groups')}
              >
                Groups
              </button>
            </div>
            
            {activeTab === 'groups' && (
              <button
                className="create-group-btn"
                onClick={() => setShowCreateGroup(true)}
              >
                +
              </button>
            )}
          </div>

          <div className="sidebar-content">
            {activeTab === 'users' && (
              <UserList
                users={users}
                onUserClick={openDirectChat}
                activeChat={activeChat}
                activeChatType={activeChatType}
              />
            )}
            
            {activeTab === 'groups' && (
              <UserList
                users={groups}
                onUserClick={openGroupChat}
                activeChat={activeChat}
                activeChatType={activeChatType}
                isGroupList={true}
              />
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-header-info">
            <h3>{getChatTitle()}</h3>
            {activeChat && activeChatType === 'direct' && (
              <span className={`user-status ${activeChat.isOnline ? 'online' : 'offline'}`}>
                {activeChat.isOnline ? 'Online' : 'Offline'}
              </span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <MessageList
            messages={messages}
            currentUser={user}
            loading={loading}
            activeChat={activeChat}
            activeChatType={activeChatType}
          />

          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!activeChat || loading}
          />
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Group</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateGroup(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="group-form">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter group description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Select Members</label>
                <div className="member-list">
                  {users.map(user => (
                    <div key={user.id} className="member-item">
                      <label className="member-checkbox">
                        <input
                          type="checkbox"
                          checked={groupForm.selectedMembers.includes(user.id)}
                          onChange={() => handleMemberToggle(user.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="member-name">{user.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateGroup(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;