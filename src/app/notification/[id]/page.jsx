// pages/notification/[id].js
'use client'
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notificationController";
import { Card, Typography, Avatar, Spin, Space, Alert, Button } from 'antd';
const { Title, Paragraph } = Typography;
const NotificationDetail = () => {
    const router = useRouter();
  const { id } = useParams();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading,setImageLoading] = useState(true);


    useEffect(() => {
        if (id) {
            const fetchNotification = async () => {
                try {
                    const response = await NotificationService.getById(id);
                    if (response.success) {
                        if(response.data){
                          setNotification(response.data);
                        }else(setNotification([]))
                        console.log(response.data);
                        
                    }
                } catch (error) {
                    console.error("Error fetching notification details", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchNotification();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ maxWidth: '800px', margin: '0 auto', 
              padding: '20px', backgroundColor: '#f4f7fc'}}>
      <Card
        style={{
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          marginBottom: '20px'
        }}
        cover={
          <div style={{ position: 'relative' }}>
              {imageLoading && (
                  <div
                      style={{
                          // position: 'absolute',
                          // top: 30,
                          // left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f4f7fc',
                          borderTopLeftRadius: '15px',
                          borderTopRightRadius: '15px',
                          height: "200px",
                      }}
                  >
                      <Spin />
                  </div>
              )}
              <img
                  src={notification?.imageUrl}
                  alt="Notification"
                  style={{
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px',
                      width:"100%",
                      height: "350px",
                      objectFit: "cover",
                      display: imageLoading ? 'none' : 'block'
                  }}
                  onLoad={() => setImageLoading(false)} // Rasim muvaffaqiyatli yuklanganda
                  onError={() => setImageLoading(false)} // Rasim yuklashda xato bo'lganda
              />
          </div>
      }
      
      >
        <Card.Meta
          title={<Title level={2} style={{ color: '#1890ff' }}>{notification?.title}</Title>}
          description={
            <>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>{notification?.text}</Paragraph>
              <div style={{ marginTop: '10px',display:'flex',gap:"10px" }}>
                <Paragraph strong style={{ fontSize: '14px', color: '#595959' }}>Schedule:</Paragraph>
                <Paragraph style={{ fontSize: '14px', color: '#333' }}>{notification?.sentTime}</Paragraph>
              </div>
            </>
          }
        />
      </Card>
    </div>
        </div>
    );
};

export default NotificationDetail;
