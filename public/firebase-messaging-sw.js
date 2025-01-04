importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize Firebase app
firebase.initializeApp({
  apiKey: "AIzaSyAYjQxXU6pVlgdJZiMRbd-Lx3GYEm9gJOg",
  authDomain: "iot-kefa.firebaseapp.com",
  projectId: "iot-kefa",
  storageBucket: "iot-kefa.appspot.com",
  messagingSenderId: "312290135090",
  appId: "1:312290135090:web:d217e82b49572aa543002b",
  measurementId: "G-PPN24PGKVD"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message', payload);

  const notificationTitle = payload.notification.title || 'Default Title';
  const notificationOptions = {
    body: payload.notification.body || 'Default Body',
    icon: payload.notification.icon || '/images/icon.png',
    badge: '/images/badge.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Enhanced push event listener
self.addEventListener('push', (event) => {
  console.log('Push event received', event);

  let payload;
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Error parsing push event data:', error);
    payload = {};
  }

  const { title = "No Title", body = "No Body" } = payload.notification || {};

  const options = {
    body: body,
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    vibrate: [200, 100, 200],
    tag: 'new-notification',
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      // If a Window tab matching the targeted URL already exists, focus that
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Otherwise, open a new window
      return self.clients.openWindow('/');
    })
  );
});
