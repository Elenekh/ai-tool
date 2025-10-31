// Django API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============================================
// Helper Functions
// ============================================

const getToken = () => localStorage.getItem('auth_token');

const getAuthHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

// ============================================
// Tools API
// ============================================

export const toolsAPI = {
  // Get all tools with filters
  getAll: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/tools/?${queryString}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single tool
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tools/${id}/`);
    return handleResponse(response);
  },

  // Create tool (admin only)
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tools/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update tool (admin only)
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/tools/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Partial update (admin only)
  patch: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/tools/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete tool (admin only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tools/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete tool');
    }
    return response.status === 204 ? null : response.json();
  },
};

// ============================================
// Blog Posts API
// ============================================

export const blogAPI = {
  // Get all blog posts
  getAll: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/blog-posts/?${queryString}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single blog post
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${id}/`);
    return handleResponse(response);
  },

  // Increment views
  incrementViews: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${id}/increment_views/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  // Create blog post (admin only)
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update blog post (admin only)
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Partial update (admin only)
  patch: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete blog post (admin only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog-posts/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete blog post');
    }
    return response.status === 204 ? null : response.json();
  },
};

// ============================================
// News API
// ============================================

export const newsAPI = {
  // Get all news
  getAll: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/news/?${queryString}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single news item
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}/`);
    return handleResponse(response);
  },

  // Create news (admin only)
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/news/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update news (admin only)
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Partial update (admin only)
  patch: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete news (admin only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete news');
    }
    return response.status === 204 ? null : response.json();
  },
};

// ============================================
// Authors API
// ============================================

export const authorsAPI = {
  // Get all authors
  getAll: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/authors/?${queryString}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single author
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}/`);
    return handleResponse(response);
  },

  // Get author by slug
  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/authors/by_slug/?slug=${slug}`);
    return handleResponse(response);
  },

  // Create author (admin only)
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/authors/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update author (admin only)
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete author (admin only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete author');
    }
    return response.status === 204 ? null : response.json();
  },
};

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!getToken();
  },

  // Get current token
  getToken: getToken,

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access);
    return data;
  },
};

// ============================================
// Export helper for extracting results from paginated response
// ============================================

export const extractResults = (response) => {
  // Django returns paginated format: { count, next, previous, results }
  // If no pagination, just returns array
  if (Array.isArray(response)) {
    return response;
  }
  return response.results || response;
};

// ============================================
// Export helper for full pagination info
// ============================================

export const getPaginationInfo = (response) => {
  if (!response || Array.isArray(response)) {
    return { count: 0, next: null, previous: null };
  }
  return {
    count: response.count || 0,
    next: response.next || null,
    previous: response.previous || null,
  };
};