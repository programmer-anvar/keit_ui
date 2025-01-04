import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { openNotification } from "./test";

const firebaseConfig = {
  apiKey: "AIzaSyBBt-dZ6b2SAfgpug-KuImUBhRvW3YBBY8",
  authDomain: "keit-not.firebaseapp.com",
  databaseURL:"https://keit-not-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "keit-not",
  storageBucket: "keit-not.firebasestorage.app",
  messagingSenderId: "555752462429",
  appId: "1:555752462429:web:a6122149d26ab6dc0315b4",
  measurementId: "G-VCNBM4VM4T"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BK4V0D4mrb8M5-eECI-7YeZKpR11jVikuJfkHh1RviXxa3rpi9ZIjtnYqJAuMbSvLSiXE9OhcHeWmgz7SyEvUxM",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    const { title, body, image } = payload.notification || {};
    openNotification(title, body,image)
  })
};
