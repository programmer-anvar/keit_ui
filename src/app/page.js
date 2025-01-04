'use client'
import React, { useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import {
//   getMessaging,
//   getToken,
//   onMessage,
//   isSupported,
// } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBBt-dZ6b2SAfgpug-KuImUBhRvW3YBBY8",
//   authDomain: "keit-not.firebaseapp.com",
//   databaseURL:
//     "https://keit-not-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "keit-not",
//   storageBucket: "keit-not.firebasestorage.app",
//   messagingSenderId: "555752462429",
//   appId: "1:555752462429:web:a6122149d26ab6dc0315b4",
//   measurementId: "G-VCNBM4VM4T",
// };

// const VAPID_KEY = "BK4V0D4mrb8M5-eECI-7YeZKpR11jVikuJfkHh1RviXxa3rpi9ZIjtnYqJAuMbSvLSiXE9OhcHeWmgz7SyEvUxM";

// const NotificationToast = ({ notifications, removeNotification }) => {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         zIndex: 1000,
//       }}
//     >
//       {notifications.map((notification) => (
//         <div
//           key={notification.id}
//           style={{
//             backgroundColor: "#fefefe",
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             padding: "15px",
//             marginBottom: "10px",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//             maxWidth: "320px",
//             animation: "fadeIn 0.3s ease",
//             position: "relative",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: "10px",
//           }}
//         >
//           <div className="notificationModal">
//           {notification.image && (
//             <img
//               src={notification.image}
//               alt="Notification"
              
//             />
//           )}
//           <div className="not--desc">
//             <div >
//               <h4>{notification.title}</h4>
//             </div>
//             <div >
//               <p>{notification.body}</p>
//             </div>
//             <div
//               style={{
//                 fontSize: "0.8em",
//                 color: "#888",
//                 marginTop: "10px",
//                 textAlign: "right",
//               }}
//             >
//               {notification.timestamp}
//             </div>
//           </div>
//           </div>
//           <button
//             onClick={() => removeNotification(notification.id)}
//             style={{
//               position: "absolute",
//               zIndex:'100',
//               top: "20px",
//               right: "25px",
//               background: "none",
//               border: "none",
//               color: "white",
//               fontSize: "22px",
//               cursor: "pointer",
//             }}
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

const MainPage = () => {
  // const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  // const [messagingSupported, setMessagingSupported] = useState(true);
  // const [notifications, setNotifications] = useState([]);

  // const removeNotification = (id) => {
  //   setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  // };

  // useEffect(() => {
  //   const initializeFirebaseApp = async () => {
  //     try {
  //       const messagingSupported = await isSupported();
  //       setMessagingSupported(messagingSupported);

  //       if (messagingSupported) {
  //         const app = initializeApp(firebaseConfig);
  //         const messaging = getMessaging(app);

  //         const token = await getToken(messaging, { vapidKey: VAPID_KEY });
  //         console.log("FCM Token:", token);

  //         onMessage(messaging, (payload) => {
  //           console.log("Message received:", payload);
  //           const { title, body, image } = payload.notification || {};
  //           setNotifications((prev) => [
  //             ...prev,
  //             {
  //               id: Date.now(),
  //               title: title || "No Title",
  //               body: body || "No Body",
  //               image: image || null,
  //               timestamp: new Date().toLocaleString(),
  //             },
  //           ]);
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Firebase initialization error:", error);
  //     }
  //   };

  //   initializeFirebaseApp();
  // }, []);

  return (
    <div>
      {/* <NotificationToast
        notifications={notifications}
        removeNotification={removeNotification}
      />
      {!messagingSupported && (
        <div style={{ color: "red", padding: "10px", background: "#ffeeee" }}>
          Push notifications are not supported in this browser.
        </div>
      )} */}
      Hoem Gape
    </div>
  );
};

export default MainPage;
