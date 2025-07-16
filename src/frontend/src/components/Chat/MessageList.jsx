import React, { useEffect, useRef } from 'react';
import { formatTime, getUserInitials, generateAvatarColor, getMessageTypeIcon } from '../../utils/helpers';
import Loading from '../Common/Loading';

const MessageList = ({ 
  messages, 
  currentUser, 
  loading, 
  activeChat, 
  activeChatType 
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isOwnMessage = (message) => {
    return message.senderId === currentUser?.id;
  };

  const getMessageSender = (message) => {
    if (isOwnMessage(message)) {
      return currentUser;
    }
    
    // For group messages, we need to find the sender
    // This is a simplified approach - in a real app, you'd want to cache user info
    return {
      id: message.senderId,
      name: message.senderId, // Fallback to ID if name not available
      avatar: null
    };
  };

  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId;
  };

  const shouldShowTimestamp = (message, index) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    const timeDiff = Number(message.timestamp) - Number(prevMessage.timestamp);
    
    // Show timestamp if more than 5 minutes apart
    return timeDiff > 300000000000; // 5 minutes in nanoseconds
  };

  if (!activeChat) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-icon">💬</div>
        <h3>Welcome to ICP Chat</h3>
        <p>Select a user or group to start chatting</p>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return <Loading message="Loading messages..." />;
  }

  if (messages.length === 0) {
    return (
      <div className="empty-messages">
        <div className="empty-messages-icon">
          {activeChatType === 'group' ? '👥' : '👤'}
        </div>
        <h3>No messages yet</h3>
        <p>Start the conversation with {activeChat.name}</p>
      </div>
    );
  }

  return (
    <div className="message-list" ref={messagesContainerRef}>
      {messages.map((message, index) => {
        const sender = getMessageSender(message);
        const isOwn = isOwnMessage(message);
        const showAvatar = shouldShowAvatar(message, index);
        const showTimestamp = shouldShowTimestamp(message, index);

        return (
          <div key={message.id} className="message-wrapper">
            {showTimestamp && (
              <div className="message-timestamp-divider">
                <span>{formatTime(message.timestamp)}</span>
              </div>
            )}
            
            <div className={`message ${isOwn ? 'own' : ''}`}>
              <div className="message-avatar-container">
                {showAvatar && !isOwn && (
                  <div
                    className="message-avatar"
                    style={{ backgroundColor: generateAvatarColor(sender.id) }}
                  >
                    {getUserInitials(sender.name)}
                  </div>
                )}
                {!showAvatar && !isOwn && (
                  <div className="message-avatar-spacer"></div>
                )}
              </div>

              <div className="message-content">
                {showAvatar && !isOwn && activeChatType === 'group' && (
                  <div className="message-sender">{sender.name}</div>
                )}
                
                <div className="message-bubble">
                  <div className="message-type-icon">
                    {getMessageTypeIcon(message.messageType)}
                  </div>
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                    {isOwn && (
                      <span className={`message-status ${message.isRead ? 'read' : 'sent'}`}>
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {loading && (
        <div className="loading-messages">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;