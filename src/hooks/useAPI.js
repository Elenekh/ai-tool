import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============== TOOLS HOOKS ==============

export const useTools = (params = {}) => {
  return useQuery({
    queryKey: ['tools', params],
    queryFn: () => apiClient.tools.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTool = (id) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => apiClient.tools.get(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.tools.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.tools.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tool', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.tools.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

// ============== BLOG POSTS HOOKS ==============

export const useBlogPosts = (params = {}) => {
  return useQuery({
    queryKey: ['blogPosts', params],
    queryFn: () => apiClient.blogPosts.list(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogPost = (id) => {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => apiClient.blogPosts.get(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useIncrementBlogViews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.blogPosts.incrementViews(id),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.blogPosts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.blogPosts.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.blogPosts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

// ============== NEWS HOOKS ==============

export const useNews = (params = {}) => {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => apiClient.news.list(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNewsItem = (id) => {
  return useQuery({
    queryKey: ['newsItem', id],
    queryFn: () => apiClient.news.get(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.news.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.news.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['newsItem', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.news.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

// ============== AUTHORS HOOKS ==============

export const useAuthors = (params = {}) => {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => apiClient.authors.list(params),
    staleTime: 10 * 60 * 1000,
  });
};

export const useAuthor = (slug) => {
  return useQuery({
    queryKey: ['author', slug],
    queryFn: () => apiClient.authors.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.authors.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.authors.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['author', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.authors.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};

// ============== AUTH HOOKS ==============

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }) => 
      apiClient.auth.login(username, password),
    onSuccess: (data) => {
      apiClient.setToken(data.access);
      if (data.refresh) {
        apiClient.setRefreshToken(data.refresh);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.auth.getCurrentUser(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};