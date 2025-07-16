import { useState, useEffect, useCallback } from 'react';
import chatAPI from '../services/api';
import { useAuth } from './useAuth';

export const useChat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatType, setActiveChatType] = useState('direct'); // 'direct' or 'group'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await chatAPI.getAllUsers();
      const filteredUsers = allUsers.filter(u => u.id !== user?.id);
      setUsers(filteredUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load groups
  const loadGroups = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userGroups = await chatAPI.getUserGroups(user.id);
      setGroups(userGroups);
    } catch (err) {
      setError('Failed to load groups');
      console.error('Load groups error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load messages for active chat
  const loadMessages = useCallback(async () => {
    if (!activeChat || !user) return;
    
    try {
      setLoading(true);
      let chatMessages = [];
      
      if (activeChatType === 'direct') {
        chatMessages = await chatAPI.getDirectMessages(user.id, activeChat.id);
      } else if (activeChatType === 'group') {
        chatMessages = await chatAPI.getGroupMessages(activeChat.id);
      }
      
      setMessages(chatMessages);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Load messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeChat, activeChatType, user?.id]);

  // Send message
  const sendMessage = useCallback(async (content, messageType = { text: null }) => {
    if (!activeChat || !user || !content.trim()) return;
    
    try {
      let result;
      
      if (activeChatType === 'direct') {
        result = await chatAPI.sendDirectMessage(user.id, activeChat.id, content, messageType);
      } else if (activeChatType === 'group') {
        result = await chatAPI.sendGroupMessage(user.id, activeChat.id, content, messageType);
      }
      
      if ('ok' in result) {
        // Reload messages to get the new message
        await loadMessages();
        return { success: true };
      } else {
        setError(result.err);
        return { success: false, error: result.err };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to send message';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [activeChat, activeChatType, user?.id, loadMessages]);

  // Create group
  const createGroup = useCallback(async (name, description, memberIds) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await chatAPI.createGroup(name, description, user.id, memberIds);
      
      if ('ok' in result) {
        await loadGroups();
        return { success: true, group: result.ok };
      } else {
        setError(result.err);
        return { success: false, error: result.err };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to create group';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadGroups]);

  // Open direct chat
  const openDirectChat = useCallback((chatUser) => {
    setActiveChat(chatUser);
    setActiveChatType('direct');
    setMessages([]);
  }, []);

  // Open group chat
  const openGroupChat = useCallback((group) => {
    setActiveChat(group);
    setActiveChatType('group');
    setMessages([]);
  }, []);

  // Initialize data
  useEffect(() => {
    if (user) {
      loadUsers();
      loadGroups();
    }
  }, [user, loadUsers, loadGroups]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages();
      
      // Set up polling for new messages
      const interval = setInterval(() => {
        loadMessages();
      }, 3000); // Poll every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [activeChat, loadMessages]);

  return {
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
    loadUsers,
    loadGroups,
    loadMessages,
    setError
  };
};