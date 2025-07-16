import React, { useState, useRef } from 'react';
import { debounce } from '../../utils/helpers';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;

    const messageToSend = message.trim();
    const typeToSend = { [messageType]: null };
    
    setMessage('');
    setIsTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(messageToSend, typeToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Typing indicator (debounced)
    if (!isTyping) {
      setIsTyping(true);
    }
    
    debouncedStopTyping();
  };

  const debouncedStopTyping = debounce(() => {
    setIsTyping(false);
  }, 1000);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Handle file upload (placeholder for now)
    console.log('File selected:', file);
    
    // You would implement file upload logic here
    // For now, we'll just show the filename as a message
    setMessage(`📎 ${file.name}`);
    setMessageType('file');
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-actions">
          <button
            type="button"
            className="action-button"
            onClick={handleFileClick}
            disabled={disabled}
            title="Attach file"
          >
            📎
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Select a chat to start messaging...' : 'Type a message...'}
            disabled={disabled}
            rows="1"
            className="message-textarea"
          />
          
          <div className="message-type-selector">
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              disabled={disabled}
              className="type-select"
            >
              <option value="text">💬 Text</option>
              <option value="image">📷 Image</option>
              <option value="document">📄 Document</option>
              <option value="file">📎 File</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="send-button"
          disabled={disabled || !message.trim()}
        >
          <span className="send-icon">
            {disabled ? '⏳' : '➤'}
          </span>
        </button>
      </form>
      
      {isTyping && (
        <div className="typing-indicator">
          <span>Typing...</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;