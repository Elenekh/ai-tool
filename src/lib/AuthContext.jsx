import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }

      // Set the token and try to get current user
      apiClient.setToken(token);
      
      try {
        const currentUser = await apiClient.auth.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (userError) {
        // Token is invalid, clear it
        apiClient.clearToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.clearToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (username, password) => {
    try {
      setAuthError(null);
      const response = await apiClient.auth.login(username, password);
      
      apiClient.setToken(response.access);
      if (response.refresh) {
        apiClient.setRefreshToken(response.refresh);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        authError,
        login,
        logout,
        navigateToLogin,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};