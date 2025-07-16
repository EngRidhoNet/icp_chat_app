import React, { createContext, useContext, useState, useEffect } from 'react';
import chatAPI from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('🔐 Found saved user:', userData);
          
          // Verify user still exists in backend
          const userExists = await chatAPI.getUser(userData.id);
          if (userExists && userExists.length > 0) {
            setUser(userData);
            console.log('✅ User authenticated:', userData);
          } else {
            console.log('❌ User not found in backend, clearing localStorage');
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email) => {
    try {
      console.log('🚀 Attempting login for:', email);
      const result = await chatAPI.loginUser(email);
      
      if ('ok' in result) {
        const userData = result.ok;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Login successful:', userData);
        return { success: true, user: userData };
      } else {
        console.error('❌ Login failed:', result.err);
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Failed to login. Please try again.' };
    }
  };

  const register = async (email, name, otp) => {
    try {
      console.log('🚀 Attempting registration for:', email);
      const result = await chatAPI.registerUser(email, name, otp);
      
      if ('ok' in result) {
        const userData = result.ok;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Registration successful:', userData);
        return { success: true, user: userData };
      } else {
        console.error('❌ Registration failed:', result.err);
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: 'Failed to register. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        console.log('🚀 Logging out user:', user.id);
        await chatAPI.logoutUser(user.id);
      }
      
      setUser(null);
      localStorage.removeItem('currentUser');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local state even if backend call fails
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const generateOTP = async (email) => {
    try {
      console.log('🚀 Generating OTP for:', email);
      const result = await chatAPI.generateOTP(email);
      
      if ('ok' in result) {
        const otp = result.ok;
        console.log('✅ OTP Generated Successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 OTP Code:', otp);
        console.log('⏰ Valid for 5 minutes');
        console.log('==================');
        
        return { success: true, otp };
      } else {
        console.error('❌ OTP generation failed:', result.err);
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('❌ OTP generation error:', error);
      return { success: false, error: 'Failed to generate OTP. Please try again.' };
    }
  };

  const updateUserProfile = async (name, avatar) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('🚀 Updating user profile:', user.id);
      const result = await chatAPI.updateUserProfile(user.id, name, avatar);
      
      if ('ok' in result) {
        const updatedUser = result.ok;
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('✅ Profile updated successfully:', updatedUser);
        return { success: true, user: updatedUser };
      } else {
        console.error('❌ Profile update failed:', result.err);
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    generateOTP,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};