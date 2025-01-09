'use client';
import KTable from '@/components/table/KTable';
import FeedBackService from '@/services/FeedBackService';
import { Card, Form, Input, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const adjustedResourceKey = "client-factories";

  const fetchDataSource = async () => {
    try {
      setLoading(true);
      const response = await FeedBackService.searchFeedBacks({ pageSize: 10, pageNumber: 1 });
      
      if (response.success) {
        setDataSource(response.data.feedbacks || []);
        console.log(response.data.feedbacks);
        
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDataSource();
  }, []);

  const columns = [
    {
      title: "문의사항 ID",
      dataIndex: "feedbackId",
      key: "feedbackId",
      width: "80px",
    },
    {
      title: "요청사항",
      dataIndex: "comment",
      key: "comment",
      width: "200px",
    },
    // {
    //   title: "유형 분류",
    //   dataIndex: "answer",
    //   key: "answer",
    //   width: "200px",
    // },
    {
      title: "등록명",
      dataIndex: "commentType",
      key: "commentType",
      width: "200px",
    },
  ];

  const handleDeleteColumn = async (feedbackId) => {
    window.location.reload(false)
    
      setLoading(true)
      try {
              const isDeleted = await FeedBackService.deleteFeedBack(feedbackId)
              if (isDeleted) {
                  notify("success", "채취정보 삭제");
                  fetchDataSource();
                  setLoading(false)
              } else {
                  throw isDeleted.message
              }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      };

  return (
    <Card>
      <Card
      extra={
        <div style={{width:"1180px",display:"flex",alignItems:"center",justifyContent:'space-between'}}>
          <h1 style={{fontSize:"17px"}}>문의사항</h1>
          <Input.Search 
          placeholder="input search text"
          // onSearch={onSearch}
          enterButton
          style={{
            width:'30%'
          }}
        />
        </div>
      }
      >
         <Form.Item
        style={{width:"20%"}}
      label="기타"
      name="username"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Input />
    </Form.Item>
      </Card>
        <KTable
          key="feedbackId"
          dataSource={dataSource.map(item=>({...item,id:item.feedbackId}))}
          initialColumns={columns}
          loading={loading}
          onSelectionChange={setSelectedKeys}
          route={adjustedResourceKey}
          isAdd={true}
          // onAddClick={() => setModalVisible(true)}
          onDeleteClick={handleDeleteColumn}
        />
        
    </Card>
  );
};

export default Feedback;