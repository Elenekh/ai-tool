import { authAPI } from './api';

// ============================================
// Authentication Service
// ============================================

export const authService = {
  // Login user and store token
  login: async (username, password) => {
    try {
      const response = await authAPI.login(username, password);

      // Django returns: { access, refresh, user: {...} }
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh);
        }
        // Store user info
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return {
          success: true,
          token: response.access,
          user: response.user,
        };
      }

      throw new Error(response.detail || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout user
  logout: () => {
    authAPI.logout();
    localStorage.removeItem('user');
    return { success: true };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return authAPI.isAuthenticated();
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: () => {
    return authAPI.getToken();
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.is_staff || false;
  },

  // Refresh access token
  refreshAccessToken: async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
        return { success: true, token: response.access };
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      authService.logout();
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// Protected Route Component (for React Router)
// ============================================

export const requireAuth = (WrappedComponent) => {
  return (props) => {
    if (!authService.isAuthenticated()) {
      // Redirect to login - implement based on your router setup
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

// ============================================
// Admin-only Route Component
// ============================================

export const requireAdmin = (WrappedComponent) => {
  return (props) => {
    if (!authService.isAuthenticated() || !authService.isAdmin()) {
      // Redirect to unauthorized - implement based on your router setup
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};