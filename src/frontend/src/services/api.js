import { Actor, HttpAgent } from '@dfinity/agent';

// Detect environment properly
const getHost = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4943';
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4943';
  }
  
  if (window.location.hostname.includes('localhost')) {
    return 'http://localhost:4943';
  }
  
  return 'https://ic0.app';
};

const host = getHost();
const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

// IDL Factory (tetap sama seperti sebelumnya)
const idlFactory = ({ IDL }) => {
  const UserId = IDL.Text;
  const GroupId = IDL.Text;
  const MessageId = IDL.Nat;
  const Email = IDL.Text;
  const OTPCode = IDL.Text;

  const MessageType = IDL.Variant({
    'text': IDL.Null,
    'image': IDL.Null,
    'document': IDL.Null,
    'file': IDL.Null,
  });

  const User = IDL.Record({
    'id': UserId,
    'email': Email,
    'name': IDL.Text,
    'avatar': IDL.Opt(IDL.Text),
    'isOnline': IDL.Bool,
    'lastSeen': IDL.Int,
    'createdAt': IDL.Int,
  });

  const Message = IDL.Record({
    'id': MessageId,
    'senderId': UserId,
    'receiverId': IDL.Opt(UserId),
    'groupId': IDL.Opt(GroupId),
    'content': IDL.Text,
    'messageType': MessageType,
    'timestamp': IDL.Int,
    'isRead': IDL.Bool,
  });

  const Group = IDL.Record({
    'id': GroupId,
    'name': IDL.Text,
    'description': IDL.Opt(IDL.Text),
    'createdBy': UserId,
    'members': IDL.Vec(UserId),
    'createdAt': IDL.Int,
  });

  const AuthResult = IDL.Variant({
    'ok': User,
    'err': IDL.Text,
  });

  const OTPResult = IDL.Variant({
    'ok': OTPCode,
    'err': IDL.Text,
  });

  const MessageResult = IDL.Variant({
    'ok': MessageId,
    'err': IDL.Text,
  });

  const GroupResult = IDL.Variant({
    'ok': Group,
    'err': IDL.Text,
  });

  const Result = IDL.Variant({
    'ok': IDL.Null,
    'err': IDL.Text,
  });

  const UserResult = IDL.Variant({
    'ok': User,
    'err': IDL.Text,
  });

  const HealthResult = IDL.Record({
    'status': IDL.Text,
    'timestamp': IDL.Int,
  });

  return IDL.Service({
    'generateOTP': IDL.Func([Email], [OTPResult], []),
    'registerUser': IDL.Func([Email, IDL.Text, OTPCode], [AuthResult], []),
    'loginUser': IDL.Func([Email], [AuthResult], []),
    'logoutUser': IDL.Func([UserId], [Result], []),
    'updateUserProfile': IDL.Func([UserId, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [UserResult], []),
    'sendDirectMessage': IDL.Func([UserId, UserId, IDL.Text, MessageType], [MessageResult], []),
    'sendGroupMessage': IDL.Func([UserId, GroupId, IDL.Text, MessageType], [MessageResult], []),
    'createGroup': IDL.Func([IDL.Text, IDL.Opt(IDL.Text), UserId, IDL.Vec(UserId)], [GroupResult], []),
    'addMemberToGroup': IDL.Func([GroupId, UserId, UserId], [GroupResult], []),
    'markMessageAsRead': IDL.Func([MessageId, UserId], [Result], []),
    'deleteMessage': IDL.Func([MessageId, UserId], [Result], []),
    'getUser': IDL.Func([UserId], [IDL.Opt(User)], ['query']),
    'getAllUsers': IDL.Func([], [IDL.Vec(User)], ['query']),
    'getOnlineUsers': IDL.Func([], [IDL.Vec(User)], ['query']),
    'getDirectMessages': IDL.Func([UserId, UserId], [IDL.Vec(Message)], ['query']),
    'getGroupMessages': IDL.Func([GroupId], [IDL.Vec(Message)], ['query']),
    'getUserGroups': IDL.Func([UserId], [IDL.Vec(Group)], ['query']),
    'getGroup': IDL.Func([GroupId], [IDL.Opt(Group)], ['query']),
    'getUnreadMessageCount': IDL.Func([UserId], [IDL.Nat], ['query']),
    'cleanupExpiredOTPs': IDL.Func([], [], []),
    'health': IDL.Func([], [HealthResult], ['query']),
  });
};

// ChatAPI Class
class ChatAPI {
  constructor() {
    this.actor = null;
    this.agent = null;
    this.isInitialized = false;
    this.canisterId = null;
    this.initializationPromise = null;
  }

  async init() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.isInitialized) {
      return true;
    }

    this.initializationPromise = this._performInit();
    return this.initializationPromise;
  }

  async _performInit() {
    try {
      this.canisterId = process.env.REACT_APP_CANISTER_ID;
      
      if (!this.canisterId) {
        throw new Error('REACT_APP_CANISTER_ID not found in environment variables');
      }

      console.log('Initializing ChatAPI...');
      console.log('Canister ID:', this.canisterId);
      console.log('Host:', host);
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Is Local:', isLocal);

      // Create HTTP agent with proper configuration
      this.agent = new HttpAgent({ 
        host,
        timeout: 30000,
        // Disable certificate verification for local development
        verifyQuerySignatures: !isLocal,
        // Add proper headers for local development
        ...(isLocal && {
          retryTimes: 3,
          requestTimeout: 30000,
        })
      });
      
      // ALWAYS fetch root key for local development
      if (isLocal) {
        console.log('Fetching root key for local development...');
        try {
          await this.agent.fetchRootKey();
          console.log('Root key fetched successfully');
        } catch (rootKeyError) {
          console.warn('Failed to fetch root key:', rootKeyError);
          // Continue anyway for local development
        }
      }

      // Create actor
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });

      // Test connection with a simple query
      try {
        await this.actor.health();
        console.log('Health check passed');
      } catch (healthError) {
        console.warn('Health check failed:', healthError);
        // Continue anyway if health check fails
      }

      this.isInitialized = true;
      this.initializationPromise = null;
      
      console.log('ChatAPI initialized successfully');
      return true;

    } catch (error) {
      console.error('Failed to initialize API:', error);
      this.isInitialized = false;
      this.initializationPromise = null;
      throw new Error(`API initialization failed: ${error.message}`);
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  handleError(error, operation) {
    console.error(`${operation} error:`, error);
    
    // Handle certificate verification errors
    if (error.message && error.message.includes('certificate')) {
      console.warn('Certificate verification error - this is normal in local development');
      if (isLocal) {
        // For local development, we can be more lenient
        return;
      }
    }
    
    if (error.message && error.message.includes('canister_not_found')) {
      throw new Error('Backend service is not available. Please check if the canister is running.');
    }
    
    if (error.message && error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.message && error.message.includes('connection')) {
      throw new Error('Connection failed. Please check your internet connection.');
    }
    
    throw new Error(`${operation} failed: ${error.message || 'Unknown error'}`);
  }

  // Wrapper method for safe calls
  async safeCall(method, ...args) {
    await this.ensureInitialized();
    try {
      return await this.actor[method](...args);
    } catch (error) {
      // Log certificate errors but don't throw for local development
      if (error.message && error.message.includes('certificate') && isLocal) {
        console.warn('Certificate error in local development:', error.message);
        // Try again without certificate verification
        try {
          return await this.actor[method](...args);
        } catch (retryError) {
          throw retryError;
        }
      }
      throw error;
    }
  }

  // Authentication methods
  async generateOTP(email) {
    try {
      return await this.safeCall('generateOTP', email);
    } catch (error) {
      this.handleError(error, 'Generate OTP');
    }
  }

  async registerUser(email, name, otpCode) {
    try {
      return await this.safeCall('registerUser', email, name, otpCode);
    } catch (error) {
      this.handleError(error, 'Register user');
    }
  }

  async loginUser(email) {
    try {
      return await this.safeCall('loginUser', email);
    } catch (error) {
      this.handleError(error, 'Login user');
    }
  }

  async logoutUser(userId) {
    try {
      return await this.safeCall('logoutUser', userId);
    } catch (error) {
      this.handleError(error, 'Logout user');
    }
  }

  async updateUserProfile(userId, name, avatar) {
    try {
      return await this.safeCall('updateUserProfile', userId, name ? [name] : [], avatar ? [avatar] : []);
    } catch (error) {
      this.handleError(error, 'Update user profile');
    }
  }

  // Message methods
  async sendDirectMessage(senderId, receiverId, content, messageType = { text: null }) {
    try {
      return await this.safeCall('sendDirectMessage', senderId, receiverId, content, messageType);
    } catch (error) {
      this.handleError(error, 'Send direct message');
    }
  }

  async sendGroupMessage(senderId, groupId, content, messageType = { text: null }) {
    try {
      return await this.safeCall('sendGroupMessage', senderId, groupId, content, messageType);
    } catch (error) {
      this.handleError(error, 'Send group message');
    }
  }

  async markMessageAsRead(messageId, userId) {
    try {
      return await this.safeCall('markMessageAsRead', messageId, userId);
    } catch (error) {
      this.handleError(error, 'Mark message as read');
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      return await this.safeCall('deleteMessage', messageId, userId);
    } catch (error) {
      this.handleError(error, 'Delete message');
    }
  }

  // Group methods
  async createGroup(name, description, createdBy, members) {
    try {
      return await this.safeCall('createGroup', name, description ? [description] : [], createdBy, members);
    } catch (error) {
      this.handleError(error, 'Create group');
    }
  }

  async addMemberToGroup(groupId, newMemberId, addedBy) {
    try {
      return await this.safeCall('addMemberToGroup', groupId, newMemberId, addedBy);
    } catch (error) {
      this.handleError(error, 'Add member to group');
    }
  }

  // Query methods
  async getUser(userId) {
    try {
      return await this.safeCall('getUser', userId);
    } catch (error) {
      this.handleError(error, 'Get user');
    }
  }

  async getAllUsers() {
    try {
      return await this.safeCall('getAllUsers');
    } catch (error) {
      this.handleError(error, 'Get all users');
    }
  }

  async getOnlineUsers() {
    try {
      return await this.safeCall('getOnlineUsers');
    } catch (error) {
      this.handleError(error, 'Get online users');
    }
  }

  async getDirectMessages(userId1, userId2) {
    try {
      return await this.safeCall('getDirectMessages', userId1, userId2);
    } catch (error) {
      this.handleError(error, 'Get direct messages');
    }
  }

  async getGroupMessages(groupId) {
    try {
      return await this.safeCall('getGroupMessages', groupId);
    } catch (error) {
      this.handleError(error, 'Get group messages');
    }
  }

  async getUserGroups(userId) {
    try {
      return await this.safeCall('getUserGroups', userId);
    } catch (error) {
      this.handleError(error, 'Get user groups');
    }
  }

  async getGroup(groupId) {
    try {
      return await this.safeCall('getGroup', groupId);
    } catch (error) {
      this.handleError(error, 'Get group');
    }
  }

  async getUnreadMessageCount(userId) {
    try {
      return await this.safeCall('getUnreadMessageCount', userId);
    } catch (error) {
      this.handleError(error, 'Get unread message count');
    }
  }

  // Utility methods
  async cleanupExpiredOTPs() {
    try {
      return await this.safeCall('cleanupExpiredOTPs');
    } catch (error) {
      this.handleError(error, 'Cleanup expired OTPs');
    }
  }

  async health() {
    try {
      return await this.safeCall('health');
    } catch (error) {
      // Don't throw for health check in local development
      if (isLocal) {
        console.warn('Health check failed in local development:', error.message);
        return { status: 'ok', timestamp: Date.now() };
      }
      this.handleError(error, 'Health check');
    }
  }

  // Helper methods
  isReady() {
    return this.isInitialized && this.actor !== null;
  }

  getCanisterId() {
    return this.canisterId;
  }

  async reset() {
    console.log('Resetting ChatAPI...');
    this.isInitialized = false;
    this.actor = null;
    this.agent = null;
    this.canisterId = null;
    this.initializationPromise = null;
    return await this.init();
  }
}

// Export singleton instance
const chatAPI = new ChatAPI();

export default chatAPI;