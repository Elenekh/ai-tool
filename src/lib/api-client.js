const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = this.getStoredToken();
  }

  getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      this.token = token;
      localStorage.setItem('access_token', token);
    }
  }

  setRefreshToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Refresh token if exists
    this.token = this.getStoredToken();
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        let errorMessage = 'API Error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Tools endpoints
  tools = {
    list: (params = {}) => this.get('/tools/', params),
    get: (id) => this.get(`/tools/${id}/`),
    create: (data) => this.post('/tools/', data),
    update: (id, data) => this.patch(`/tools/${id}/`, data),
    delete: (id) => this.delete(`/tools/${id}/`),
  };

  // Blog posts endpoints
  blogPosts = {
    list: (params = {}) => this.get('/blog-posts/', params),
    get: (id) => this.get(`/blog-posts/${id}/`),
    create: (data) => this.post('/blog-posts/', data),
    update: (id, data) => this.patch(`/blog-posts/${id}/`, data),
    delete: (id) => this.delete(`/blog-posts/${id}/`),
    incrementViews: (id) => this.post(`/blog-posts/${id}/increment_views/`, {}),
  };

  // News endpoints
  news = {
    list: (params = {}) => this.get('/news/', params),
    get: (id) => this.get(`/news/${id}/`),
    create: (data) => this.post('/news/', data),
    update: (id, data) => this.patch(`/news/${id}/`, data),
    delete: (id) => this.delete(`/news/${id}/`),
  };

  // Authors endpoints
  authors = {
    list: (params = {}) => this.get('/authors/', params),
    get: (id) => this.get(`/authors/${id}/`),
    getBySlug: (slug) => this.get('/authors/by_slug/', { slug }),
    create: (data) => this.post('/authors/', data),
    update: (id, data) => this.patch(`/authors/${id}/`, data),
    delete: (id) => this.delete(`/authors/${id}/`),
  };

  // Auth endpoints
  auth = {
    login: (username, password) => 
      this.post('/auth/login/', { username, password }),
    logout: () => {
      this.clearToken();
      return Promise.resolve({ detail: 'Logged out successfully' });
    },
    getCurrentUser: () => this.get('/auth/user/'),
  };
}

export const apiClient = new APIClient();