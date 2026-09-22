// Browser Web Push / VAPID System Notification Manager

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[WebPush] This browser does not support desktop/mobile notifications.');
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

export async function subscribeUserToPush(api) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[WebPush] Push messaging is not supported in this browser environment');
    return null;
  }

  try {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn('[WebPush] Notification permission was denied or dismissed by user');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Fetch VAPID public key from env or backend API
      let vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey && api?.getVapidPublicKey) {
        try {
          const res = await api.getVapidPublicKey();
          vapidKey = res?.publicKey;
        } catch (e) {
          console.warn('[WebPush] Could not fetch public key from backend:', e);
        }
      }

      if (!vapidKey) {
        console.warn('[WebPush] No VAPID public key found for push subscription');
        return null;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log('[WebPush] Registered new browser push subscription');
    }

    // Register subscription with the backend server
    if (subscription && api?.subscribePush) {
      const subJson = subscription.toJSON();
      await api.subscribePush({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
        userAgent: navigator.userAgent,
      });
      console.log('[WebPush] Push subscription synced with backend server');
    }

    return subscription;
  } catch (err) {
    console.error('[WebPush] Failed to subscribe user to Web Push:', err);
    return null;
  }
}

export async function unsubscribeUserFromPush(api) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      if (api?.unsubscribePush) {
        await api.unsubscribePush(endpoint);
      }
      console.log('[WebPush] Push subscription removed');
    }
  } catch (err) {
    console.error('[WebPush] Failed to unsubscribe:', err);
  }
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