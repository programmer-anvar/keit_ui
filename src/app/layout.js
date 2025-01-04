"use client";
import { usePathname } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { ConfigProvider } from "antd";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Providers } from "@/app/providers";
import dayjs from "dayjs";
import locale from "antd/locale/ko_KR";
dayjs.locale('ko');

import "./globals.css";
import { useEffect, useState } from "react";
import PagesService from "@/services/pageController";

import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { NotificationService } from "@/services/notificationController";

const firebaseConfig = {
  apiKey: "AIzaSyAYjQxXU6pVlgdJZiMRbd-Lx3GYEm9gJOg",
  authDomain: "iot-kefa.firebaseapp.com",
  projectId: "iot-kefa",
  storageBucket: "iot-kefa.appspot.com",
  messagingSenderId: "312290135090",
  appId: "1:312290135090:web:d217e82b49572aa543002b",
  measurementId: "G-PPN24PGKVD"
};



const VAPID_KEY = "BI8_M7j63XQsOPJXxWCPnybErfQrQxW2CiAxvw7saMFHXD2055sp3ij6ugjtYfURhOxzUiMrkub1JCbQVLHHiWE";

const NotificationToast = ({ notifications, removeNotification }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {notifications.map((notification) => (
        <div
        onClick={() => window.location.href='/notification'}
          key={notification.id}
          style={{
            backgroundColor: "#fefefe",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            maxWidth: "320px",
            animation: "fadeIn 0.3s ease",
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <div className="notificationModal">
          {notification.image && (
            <img
              src={notification.image}
              alt="Notification"
              
            />
          )}
          <div className="not--desc">
            <div style={{display:'flex', alignItems:"center", justifyContent:"space-between"}}>
              <h4>{notification.title}</h4>
              <button
            onClick={(e) => {
              e.stopPropagation()
              removeNotification(notification.id)}}
            style={{
              // position: "absolute",
              // zIndex:'100',
              // top: "20px",
              // right: "25px",
              background: "none",
              border: "none",
              color: "black",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
            </div>
            <div >
              <p>{notification.body}</p>
            </div>
            <div
              style={{
                fontSize: "0.8em",
                color: "#888",
                marginTop: "10px",
                textAlign: "right",
              }}
            >
              {/* {notification.timestamp} */}
              <button className="isReadBtn">is read</button>
            </div>
          </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};
const theme = {
    token: {
        colorPrimary: "#1677ff",
        borderRadius: 2,
        colorBgContainer: "#fff",
    }
};

const getUserDeviceData = async () => {
    const FCtoken = localStorage.getItem("fcmToken");
    return {
        platform: navigator.platform,
        browserType: navigator.userAgent.includes("Chrome") ? "Chrome" : "Other",
        firebaseToken:FCtoken
    };
};
const sendDataToAPI = async (data) => {
    try {
        const response = await PagesService.createUserToken(data);
        console.log(response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};




export default function RootLayout({ children }) {
    const pathname = usePathname();
    
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

      const [firebaseInitialized, setFirebaseInitialized] = useState(false);
      const [messagingSupported, setMessagingSupported] = useState(true);
      const [notifications, setNotifications] = useState([]);

    //  const fetNotificationId = async () =>{
    //   try{
    //     const response = await NotificationService.get();
    //     if(response.success){
    //       setNotifications(response.data || [])
          
    //     }
    //     console.log(response);
        
    //   }catch(err){
    //     console.log(err);
    //   }
    //  }

    //  useEffect(() =>{
    //   fetNotificationId()
    //  },[])
    
      const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      };
    
      useEffect(() => {
        const initializeFirebaseApp = async () => {
          try {
            const messagingSupported = await isSupported();
            setMessagingSupported(messagingSupported);
    
            if (messagingSupported) {
              const app = initializeApp(firebaseConfig);
              const messaging = getMessaging(app);
              const token = await getToken(messaging, { vapidKey: VAPID_KEY });
              console.log("FCM Token:", token);
              if (token) {
                localStorage.setItem("fcmToken", token);
              }
              onMessage(messaging, (payload) => {
                console.log("Message received:", payload);
                const { title, body, image } = payload.notification || {};
                setNotifications((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    title: title || "No Title",
                    body: body || "No Body",
                    image: image || null,
                    timestamp: new Date().toLocaleString(),
                  },
                ]);
              });
            }
          } catch (error) {
            console.error("Firebase initialization error:", error);
          }
        };
    
        initializeFirebaseApp();
      }, []);

    const handleSendData = async () => {
        setLoading(true);
        setError(null);
        try {
            const userDeviceData = await getUserDeviceData();
            const apiResponse = await sendDataToAPI(userDeviceData);
            setResponse(apiResponse);
            console.log(userDeviceData);
            
        } catch (err) {
            setError("Xatolik yuz berdi! Iltimos, qayta urinib ko'ring.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>{
        handleSendData()
    },[])
    
    const pageTypes = {
        auth: ['/login'],
        error: ['/error'],
        fullPage: ['/login', '/error', '/not-found']
    };

    const isFullPage = pageTypes.fullPage.some(path => pathname === path);
    
    const baseLayout = (content) => (
        <html lang="ko">
            <body>
                <ConfigProvider locale={locale} theme={theme}>
                <NotificationToast
                  notifications={notifications}
                  removeNotification={removeNotification}
                />
                    {content}
                </ConfigProvider>
            </body>
        </html>
    );
    if (isFullPage) {
        return baseLayout(
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {children}
            </div>
        );
    }

    // Main application layout
    return baseLayout(
        <Providers>
            <SidebarProvider>
                <MainLayout>
              
                    {children}
                </MainLayout>
            </SidebarProvider>
        </Providers>
    );
}