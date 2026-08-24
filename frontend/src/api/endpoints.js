import client from './client';

export const authAPI = {
  login: (credentials) => client.post('/auth/login', credentials),
  logout: () => client.post('/auth/logout'),
  getMe: () => client.get('/auth/me'),
  refreshToken: (refreshToken) => client.post('/auth/refresh-token', { refreshToken }),
  updatePassword: (data) => client.put('/auth/password', data),
};

export const profileAPI = {
  get: () => client.get('/profile'),
  update: (data) => client.put('/profile', data),
  getPublic: () => client.get('/profile/public'),
};

export const educationAPI = {
  getAll: (params) => client.get('/education', { params }),
  getById: (id) => client.get(`/education/${id}`),
  create: (data) => client.post('/education', data),
  update: (id, data) => client.put(`/education/${id}`, data),
  delete: (id) => client.delete(`/education/${id}`),
  reorder: (data) => client.put('/education/reorder', data),
};

export const skillAPI = {
  getAll: (params) => client.get('/skills', { params }),
  getFeatured: () => client.get('/skills/featured'),
  getById: (id) => client.get(`/skills/${id}`),
  create: (data) => client.post('/skills', data),
  update: (id, data) => client.put(`/skills/${id}`, data),
  delete: (id) => client.delete(`/skills/${id}`),
  reorder: (data) => client.put('/skills/reorder', data),
};

export const experienceAPI = {
  getAll: (params) => client.get('/experience', { params }),
  getById: (id) => client.get(`/experience/${id}`),
  create: (data) => client.post('/experience', data),
  update: (id, data) => client.put(`/experience/${id}`, data),
  delete: (id) => client.delete(`/experience/${id}`),
  reorder: (data) => client.put('/experience/reorder', data),
};

export const publicationAPI = {
  getAll: (params) => client.get('/publications', { params }),
  getFeatured: () => client.get('/publications/featured'),
  getById: (id) => client.get(`/publications/${id}`),
  create: (data) => client.post('/publications', data),
  update: (id, data) => client.put(`/publications/${id}`, data),
  delete: (id) => client.delete(`/publications/${id}`),
};

export const researchProjectAPI = {
  getAll: (params) => client.get('/research-projects', { params }),
  getFeatured: () => client.get('/research-projects/featured'),
  getById: (id) => client.get(`/research-projects/${id}`),
  create: (data) => client.post('/research-projects', data),
  update: (id, data) => client.put(`/research-projects/${id}`, data),
  delete: (id) => client.delete(`/research-projects/${id}`),
};

export const projectAPI = {
  getAll: (params) => client.get('/projects', { params }),
  getFeatured: () => client.get('/projects/featured'),
  getById: (id) => client.get(`/projects/${id}`),
  create: (data) => client.post('/projects', data),
  update: (id, data) => client.put(`/projects/${id}`, data),
  delete: (id) => client.delete(`/projects/${id}`),
  reorder: (data) => client.put('/projects/reorder', data),
};

export const expertiseAPI = {
  getAll: (params) => client.get('/expertise', { params }),
  getFeatured: () => client.get('/expertise/featured'),
  getById: (id) => client.get(`/expertise/${id}`),
  create: (data) => client.post('/expertise', data),
  update: (id, data) => client.put(`/expertise/${id}`, data),
  delete: (id) => client.delete(`/expertise/${id}`),
  reorder: (data) => client.put('/expertise/reorder', data),
};

export const resourceAPI = {
  getAll: (params) => client.get('/resources', { params }),
  getFeatured: () => client.get('/resources/featured'),
  getById: (id) => client.get(`/resources/${id}`),
  create: (data) => client.post('/resources', data),
  update: (id, data) => client.put(`/resources/${id}`, data),
  delete: (id) => client.delete(`/resources/${id}`),
  download: (id) => client.get(`/resources/${id}/download`, { responseType: 'blob' }),
};

export const serviceAPI = {
  getAll: (params) => client.get('/services', { params }),
  getFeatured: () => client.get('/services/featured'),
  getById: (id) => client.get(`/services/${id}`),
  create: (data) => client.post('/services', data),
  update: (id, data) => client.put(`/services/${id}`, data),
  delete: (id) => client.delete(`/services/${id}`),
  reorder: (data) => client.put('/services/reorder', data),
};

export const serviceRequestAPI = {
  getAll: (params) => client.get('/service-requests', { params }),
  getById: (id) => client.get(`/service-requests/${id}`),
  getStats: () => client.get('/service-requests/stats'),
  create: (data) => client.post('/service-requests', data),
  updateStatus: (id, data) => client.put(`/service-requests/${id}/status`, data),
  addNote: (id, data) => client.post(`/service-requests/${id}/notes`, data),
};

export const appointmentAPI = {
  getAll: (params) => client.get('/appointments', { params }),
  getById: (id) => client.get(`/appointments/${id}`),
  create: (data) => client.post('/appointments', data),
  updateStatus: (id, data) => client.put(`/appointments/${id}/status`, data),
};

export const articleAPI = {
  getAll: (params) => client.get('/articles', { params }),
  getFeatured: () => client.get('/articles/featured'),
  getById: (id) => client.get(`/articles/${id}`),
  create: (data) => client.post('/articles', data),
  update: (id, data) => client.put(`/articles/${id}`, data),
  delete: (id) => client.delete(`/articles/${id}`),
};

export const commentAPI = {
  getAll: (params) => client.get('/comments', { params }),
  getByEntity: (entityType, entityId, params) =>
    client.get(`/comments/entity/${entityType}/${entityId}`, { params }),
  create: (data) => client.post('/comments', data),
  updateStatus: (id, data) => client.put(`/comments/${id}/status`, data),
  delete: (id) => client.delete(`/comments/${id}`),
  report: (id, data) => client.post(`/comments/${id}/report`, data),
};

export const newsletterAPI = {
  subscribe: (data) => client.post('/newsletter/subscribe', data),
  unsubscribe: (email) => client.post('/newsletter/unsubscribe', { email }),
  verify: (token) => client.get(`/newsletter/verify/${token}`),
  getAll: (params) => client.get('/newsletter', { params }),
  delete: (id) => client.delete(`/newsletter/${id}`),
};

export const contactAPI = {
  getAll: (params) => client.get('/contact', { params }),
  getById: (id) => client.get(`/contact/${id}`),
  create: (data) => client.post('/contact', data),
  updateStatus: (id, data) => client.put(`/contact/${id}/status`, data),
  addNote: (id, data) => client.post(`/contact/${id}/notes`, data),
};

export const analyticsAPI = {
  track: (data) => client.post('/analytics/track', data),
  getStats: (params) => client.get('/analytics/stats', { params }),
  getPopular: (params) => client.get('/analytics/popular', { params }),
  getTypes: (params) => client.get('/analytics/types', { params }),
  getTimeline: (params) => client.get('/analytics/timeline', { params }),
};

export const mediaAPI = {
  getAll: (params) => client.get('/media', { params }),
  upload: (data) =>
    client.post('/media/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => client.delete(`/media/${id}`),
};

export const searchAPI = {
  search: (params) => client.get('/search', { params }),
};

export const settingsAPI = {
  getAll: () => client.get('/settings'),
  getPublic: () => client.get('/settings/public'),
  getByKey: (key) => client.get(`/settings/${key}`),
  update: (data) => client.put('/settings', data),
};

export const translationAPI = {
  getAll: (params) => client.get('/translations', { params }),
  getByEntity: (entityType, entityId) =>
    client.get(`/translations/${entityType}/${entityId}`),
  create: (data) => client.post('/translations', data),
  update: (id, data) => client.put(`/translations/${id}`, data),
  createOrUpdate: (data) => client.post('/translations', data),
  markOutdated: (id) => client.put(`/translations/${id}/outdated`),
  delete: (id) => client.delete(`/translations/${id}`),
};

export const userAPI = {
  getAll: (params) => client.get('/users', { params }),
  getById: (id) => client.get(`/users/${id}`),
  create: (data) => client.post('/users', data),
  updateRole: (id, data) => client.put(`/users/${id}/role`, data),
  updatePermissions: (id, data) => client.put(`/users/${id}/permissions`, data),
  resetPassword: (id, data) => client.put(`/users/${id}/reset-password`, data),
  activate: (id) => client.put(`/users/${id}/activate`),
  deactivate: (id) => client.put(`/users/${id}/deactivate`),
  getSessions: (id) => client.get(`/users/${id}/sessions`),
  revokeSession: (id, sessionId) => client.delete(`/users/${id}/sessions/${sessionId}`),
  revokeAllSessions: (id) => client.delete(`/users/${id}/sessions`),
  getPermissions: () => client.get('/users/permissions'),
};

export const contentVersionAPI = {
  create: (data) => client.post('/content-versions', data),
  getHistory: (resourceType, resourceId, params) =>
    client.get(`/content-versions/resource/${resourceType}/${resourceId}`, { params }),
  getById: (id) => client.get(`/content-versions/${id}`),
  compare: (versionA, versionB) => client.get(`/content-versions/compare/${versionA}/${versionB}`),
  updateStatus: (id, data) => client.put(`/content-versions/${id}/status`, data),
  restore: (id) => client.post(`/content-versions/${id}/restore`),
  getPendingReview: (params) => client.get('/content-versions/pending-review', { params }),
};

export const announcementAPI = {
  getAll: (params) => client.get('/announcements', { params }),
  getPublic: (params) => client.get('/announcements/public', { params }),
  getById: (id) => client.get(`/announcements/${id}`),
  create: (data) => client.post('/announcements', data),
  update: (id, data) => client.put(`/announcements/${id}`, data),
  delete: (id) => client.delete(`/announcements/${id}`),
  trackView: (id) => client.post(`/announcements/${id}/view`),
  trackClick: (id) => client.post(`/announcements/${id}/click`),
};

export const healthAPI = {
  check: () => client.get('/health'),
  database: () => client.get('/health/database'),
  system: () => client.get('/health/system'),
  storage: () => client.get('/health/storage'),
};

export const exportAPI = {
  contacts: () => client.get('/export/contacts', { responseType: 'blob' }),
  comments: () => client.get('/export/comments', { responseType: 'blob' }),
  serviceRequests: () => client.get('/export/service-requests', { responseType: 'blob' }),
  auditLogs: () => client.get('/export/audit-logs', { responseType: 'blob' }),
  analytics: () => client.get('/export/analytics', { responseType: 'blob' }),
};

export const auditLogAPI = {
  getAll: (params) => client.get('/audit-logs', { params }),
  getByEntity: (entityType, entityId, params) =>
    client.get(`/audit-logs/${entityType}/${entityId}`, { params }),
};

export const faqAPI = {
  getAll: (params) => client.get('/faqs', { params }),
  getById: (id) => client.get(`/faqs/${id}`),
  create: (data) => client.post('/faqs', data),
  update: (id, data) => client.put(`/faqs/${id}`, data),
  delete: (id) => client.delete(`/faqs/${id}`),
  reorder: (data) => client.put('/faqs/reorder', data),
};

export const testimonialAPI = {
  getAll: (params) => client.get('/testimonials', { params }),
  getFeatured: () => client.get('/testimonials/featured'),
  create: (data) => client.post('/testimonials', data),
  update: (id, data) => client.put(`/testimonials/${id}`, data),
  delete: (id) => client.delete(`/testimonials/${id}`),
};

export const academicTitleAPI = {
  getAll: (params) => client.get('/academic-titles', { params }),
  getById: (id) => client.get(`/academic-titles/${id}`),
  create: (data) => client.post('/academic-titles', data),
  update: (id, data) => client.put(`/academic-titles/${id}`, data),
  delete: (id) => client.delete(`/academic-titles/${id}`),
};

export const researchInterestAPI = {
  getAll: (params) => client.get('/research-interests', { params }),
  getFeatured: () => client.get('/research-interests/featured'),
  create: (data) => client.post('/research-interests', data),
  update: (id, data) => client.put(`/research-interests/${id}`, data),
  delete: (id) => client.delete(`/research-interests/${id}`),
};

export const bookAPI = {
  getAll: (params) => client.get('/books', { params }),
  getPublished: (params) => client.get('/books/published', { params }),
  getBySlug: (slug) => client.get(`/books/${slug}`),
  getById: (id) => client.get(`/books/admin/${id}`),
  create: (data) => client.post('/books', data),
  update: (id, data) => client.put(`/books/${id}`, data),
  delete: (id) => client.delete(`/books/${id}`),
  incrementDownload: (id) => client.post(`/books/${id}/download`),
};
