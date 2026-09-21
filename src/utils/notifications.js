// Browser Push / System Notification Manager
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendPushNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions = {
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [200, 100, 200],
    ...options,
  };

  try {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, defaultOptions);
      });
      return;
    }
    return new Notification(title, defaultOptions);
  } catch (err) {
    console.error('Failed to trigger push notification:', err);
  }
}