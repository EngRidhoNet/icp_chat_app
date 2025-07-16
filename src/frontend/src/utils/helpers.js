export const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };
  
  export const formatTime = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  export const getUserInitials = (name) => {
    if (!name) return '?';
    
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validateOTP = (otp) => {
    return /^\d{6}$/.test(otp);
  };
  
  export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  export const getMessageTypeIcon = (messageType) => {
    switch (messageType) {
      case 'text':
        return '💬';
      case 'image':
        return '📷';
      case 'document':
        return '📄';
      case 'file':
        return '📎';
      default:
        return '💬';
    }
  };
  
  export const generateAvatarColor = (userId) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  export const isValidMessageContent = (content) => {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    return trimmed.length > 0 && trimmed.length <= 1000;
  };
  
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  };
  
  export const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = getFileExtension(filename);
    return imageExtensions.includes(extension);
  };
  
  export const isDocumentFile = (filename) => {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const extension = getFileExtension(filename);
    return documentExtensions.includes(extension);
  };
  
  export const getMessageTypeFromFile = (filename) => {
    if (isImageFile(filename)) return 'image';
    if (isDocumentFile(filename)) return 'document';
    return 'file';
  };
  
  export const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  export const formatDateTime = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };
  
  export const sortMessagesByTimestamp = (messages) => {
    return [...messages].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  };
  
  export const groupMessagesByDate = (messages) => {
    const grouped = {};
    
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  };
  
  export const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };
  
  export const formatUserStatus = (user) => {
    if (!user) return 'Unknown';
    
    if (user.isOnline) {
      return 'Online';
    } else {
      return `Last seen ${formatTimestamp(user.lastSeen)}`;
    }
  };
  
  export const getInitialsColor = (name) => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  export const isOnline = (user) => {
    if (!user) return false;
    return user.isOnline;
  };
  
  export const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(Number(timestamp) / 1000000);
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };
  
  export const searchUsers = (users, query) => {
    if (!query.trim()) return users;
    
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  export const searchMessages = (messages, query) => {
    if (!query.trim()) return messages;
    
    const lowercaseQuery = query.toLowerCase();
    return messages.filter(message => 
      message.content.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  export const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };
  
  export const sanitizeInput = (input) => {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  };
  
  export const validateGroupName = (name) => {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 1 && trimmed.length <= 50;
  };
  
  export const validateUserName = (name) => {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 1 && trimmed.length <= 100;
  };
  
  export const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error && error.message) return error.message;
    return 'An unexpected error occurred';
  };
  
  export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  };
  
  export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  export const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  };
  
  export const formatMessageForDisplay = (message) => {
    if (!message || !message.content) return '';
    
    // Basic text formatting
    let formatted = message.content;
    
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };
  
  export const constants = {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_GROUP_NAME_LENGTH: 50,
    MAX_USER_NAME_LENGTH: 100,
    OTP_LENGTH: 6,
    POLL_INTERVAL: 3000,
    RETRY_DELAY: 1000,
    MAX_RETRIES: 3,
    SUPPORTED_FILE_TYPES: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  };