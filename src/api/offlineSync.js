// Offline Queue Manager using localStorage / IndexedDB fallback
const OFFLINE_QUEUE_KEY = 'taskstreak_offline_queue';

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function queueOfflineRequest(method, url, body) {
  const queue = getOfflineQueue();
  const item = {
    id: 'off_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
    method,
    url,
    body,
  };
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  console.log('[OfflineSync] Queued request:', item);
  return item;
}

export async function flushOfflineQueue(apiClient, onSynced) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`[OfflineSync] Syncing ${queue.length} offline operations...`);
  const remaining = [];

  for (const item of queue) {
    try {
      if (item.method === 'POST') {
        await apiClient.post(item.url, item.body, false);
      } else if (item.method === 'PATCH') {
        await apiClient.patch(item.url, item.body, false);
      } else if (item.method === 'PUT') {
        await apiClient.put(item.url, item.body, false);
      }
    } catch (err) {
      console.error('[OfflineSync] Failed to sync item:', item, err);
      remaining.push(item);
    }
  }

  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
  if (onSynced && queue.length > remaining.length) {
    onSynced(queue.length - remaining.length);
  }
}