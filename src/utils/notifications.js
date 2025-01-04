import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
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
  });
};
