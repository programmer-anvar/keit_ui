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

    useEffect(() => {
        if (id) {
            const fetchNotification = async () => {
                try {
                    const response = await NotificationService.getById(id);
                    if (response.success) {
                        setNotification(response.data);
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
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f7fc'}}>
      <Card
        style={{
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          marginBottom: '20px'
        }}
        cover={<img  src={notification?.imageUrl} 
        style={{ borderTopLeftRadius: '15px', 
            borderTopRightRadius: '15px',maxHeight:"350px",objectFit:"cover" }} />}
      >
        <Card.Meta
        //   avatar={<Avatar src={notification?.imageUrl} size={64} />}
          title={<Title level={2} style={{ color: '#1890ff' }}>{notification?.title}</Title>}
          description={
            <>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>{notification?.text}</Paragraph>
              <div style={{ marginTop: '10px' }}>
                <Paragraph strong style={{ fontSize: '14px', color: '#595959' }}>Schedule:</Paragraph>
                <Paragraph style={{ fontSize: '16px', color: '#333' }}>{notification?.sentTime}</Paragraph>
                {/* <Paragraph strong style={{ fontSize: '14px', color: '#595959' }}>Color:</Paragraph> */}
                {/* <Paragraph style={{ fontSize: '16px', color: '#333' }}>{userData.color}</Paragraph> */}
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
