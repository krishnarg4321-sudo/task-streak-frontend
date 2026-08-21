import { queueOfflineRequest, flushOfflineQueue } from './offlineSync';

const BASE_URL = import.meta.env.VITE_API_URL || '';

let authToken = localStorage.getItem('taskstreak_token') || '';

export function setToken(token) {
  authToken = token || '';
  if (token) {
    localStorage.setItem('taskstreak_token', token);
  } else {
    localStorage.removeItem('taskstreak_token');
  }
}

export function getToken() {
  return authToken;
}

async function request(path, options = {}, allowOfflineQueue = true) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // Clear token on 401
      setToken('');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    if (!response.ok) {
      let errData = {};
      try {
        errData = await response.json();
      } catch (e) {}
      throw new Error(errData.error || errData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    // Offline detection
    const isOffline = !navigator.onLine || error.message.includes('Failed to fetch') || error.name === 'TypeError';
    if (isOffline && allowOfflineQueue && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
      console.warn('[API Client] Offline mode detected. Queuing mutation:', path);
      queueOfflineRequest(options.method, path, options.body ? JSON.parse(options.body) : null);
      
      // Return simulated optimistic response for tasks
      if (path.includes('/api/tasks')) {
        const bodyObj = options.body ? JSON.parse(options.body) : {};
        return {
          id: 'temp_' + Date.now(),
          ...bodyObj,
          status: bodyObj.status || 'NOT_COMPLETED',
          createdAt: new Date().toISOString(),
          isOfflineDraft: true
        };
      }
    }
    throw error;
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, allowOffline = true) => request(path, { method: 'POST', body: JSON.stringify(body) }, allowOffline),
  patch: (path, body, allowOffline = true) => request(path, { method: 'PATCH', body: JSON.stringify(body) }, allowOffline),
  put: (path, body, allowOffline = true) => request(path, { method: 'PUT', body: JSON.stringify(body) }, allowOffline),
  delete: (path) => request(path, { method: 'DELETE' }),

  // Auth
  login: (credentials) => api.post('/api/auth/login', credentials, false),
  signup: (userData) => api.post('/api/auth/signup', userData, false),
  getMe: () => api.get('/api/users/me'),
  updateProfile: (profile) => api.put('/api/users/me', profile),
  searchUsers: (query) => api.get(`/api/users/search?q=${encodeURIComponent(query)}`),

  // Tasks
  getTodayTasks: () => api.get('/api/tasks/today'),
  getTaskById: (id) => api.get(`/api/tasks/${id}`),
  createTask: (task) => api.post('/api/tasks', task),
  updateTaskStatus: (id, status) => api.patch(`/api/tasks/${id}/status`, { status }),
  updateTaskTimer: (id, data) => api.patch(`/api/tasks/${id}/timer`, data),
  updateChecklist: (id, checklist) => api.put(`/api/tasks/${id}/checklist`, checklist),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  getHistory: (range = 'week') => api.get(`/api/tasks/history?range=${range}`),

  // Friends & Social
  getFriends: () => api.get('/api/friends'),
  sendFriendRequest: (usernameOrEmail) => api.post('/api/friends/request', { usernameOrEmail }),
  acceptFriendRequest: (friendshipId) => api.post('/api/friends/accept', { friendshipId }),
  getFriendProgress: (friendId) => api.get(`/api/friends/${friendId}/progress`),

  // Groups & Streaks
  getUserGroups: () => api.get('/api/groups'),
  createGroup: (group) => api.post('/api/groups', group),
  addGroupMember: (groupId, usernameOrEmail) => api.post(`/api/groups/${groupId}/members`, { usernameOrEmail }),
  getGroupProgress: (groupId) => api.get(`/api/groups/${groupId}/progress`),
  getWeeklyStreaks: (groupId) => api.get(`/api/streaks/${groupId}/weekly`),

  // Notifications
  getNotifications: () => api.get('/api/notifications'),
  markNotificationRead: (id) => api.post('/api/notifications/read', { id }),
  markAllNotificationsRead: () => api.post('/api/notifications/read', {}),

  // Flush offline queue
  syncOffline: (onSynced) => flushOfflineQueue(api, onSynced)
};