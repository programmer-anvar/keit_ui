'use client'
import SiteMap from "@/components/sitemap/Sitemap";
import useKNotification from "@/hooks/useKNotification";
import FeedBackService from "@/services/FeedBackService";
import { Button, Card, Col, Form, Input, Radio, Row, Select, Typography } from "antd";
import React, { useState } from "react";
const { Title } = Typography; 

const Profile = () => {
  const [formData, setFormData] = useState({ comment: '', commentType: '' });
  const { SUCCESS, ERROR, contextHolder } = useKNotification();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value, option) => {
    setFormData(prevData => ({ ...prevData, commentType: option.label })); // Store the label instead of value
  };

  const handleSubmit = async () => {
    try {
      const response = await FeedBackService.addFeedBack(formData);
      if(response.success){
        SUCCESS('Feedback submitted successfully!');
        // Clear the input fields
        setFormData({ comment: '', commentType: '' });
      }
      console.log('Feedback submitted successfully:', response);
    } catch (error) {
      ERROR('Error submitting feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    }
  };

  const getOptions = (siteMap) => {
    const options = [];
    
    siteMap.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          options.push({
            value: child.key,
            label: child.label,
          });

          if (child.children) {
            child.children.forEach(nestedChild => {
              options.push({
                value: nestedChild.key,
                label: nestedChild.label,
              });
            });
          }
        });
      }
    });

    return options;
  };

  const options = getOptions(SiteMap);

  return (
    <div>
      {contextHolder} 
      <Card style={{borderRadius:"10px"}}>
      <Form
                name="form_name"
                layout="vertical"
                style={{ maxWidth: '100%' }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="담당자아이디"
                            label="담당자아이디"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="admin" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="담당자패스워드"
                            label="담당자패스워드"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="담당자패스워드" />
                        </Form.Item>
                    </Col>
                </Row>
              
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="담당자명"
                            label="담당자명"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="담당자명" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="이메일"
                            label="이메일"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="이메일" />
                        </Form.Item>
                    </Col>
                </Row>
                  
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="전화번호"
                            label="전화번호"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="전화번호" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="팩스번호"
                            label="팩스번호"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="팩스번호" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                  <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    options={[
                      {
                        value: '1',
                        label: 'Not Identified',
                      },
                      {
                        value: '2',
                        label: 'Closed',
                      },
                      {
                        value: '3',
                        label: 'Communicated',
                      },
                      {
                        value: '4',
                        label: 'Identified',
                      },
                      {
                        value: '5',
                        label: 'Resolved',
                      },
                      {
                        value: '6',
                        label: 'Cancelled',
                      },
                    ]}
                    style={{width:'100%'}}
                  />
                  </Col>
                  <Col span={12}>
                  <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    options={[
                      {
                        value: '1',
                        label: 'Not Identified',
                      },
                      {
                        value: '2',
                        label: 'Closed',
                      },
                      {
                        value: '3',
                        label: 'Communicated',
                      },
                      {
                        value: '4',
                        label: 'Identified',
                      },
                      {
                        value: '5',
                        label: 'Resolved',
                      },
                      {
                        value: '6',
                        label: 'Cancelled',
                      },
                    ]}
                    style={{width:'100%'}}
                  />
                  </Col>
                </Row>
                <Row style={{marginTop:"30px"}}>
                <Radio.Group >
                  <Radio.Button value="horizontal">사용</Radio.Button>
                  <Radio.Button value="vertical">대기</Radio.Button>
                  <Radio.Button value="inline">삭제</Radio.Button>
                </Radio.Group>
                </Row>
            </Form>
      </Card>

      <Card style={{borderRadius:"10px",marginTop:"30px"}}>
        <Col>
          <h2>요청사항</h2>
          <Form>
            <Col style={{ display: "flex", alignItems: 'center', gap: '15px' }}>
              <Input
                required
                name="comment"
                placeholder="Basic usage"
                value={formData.comment}
                onChange={handleInputChange}
              />
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Comment Type"
                optionFilterProp="label"
                options={options}
                onChange={handleSelectChange}
              />
            </Col>
            <Button style={{ marginTop: "15px" }} type="primary" onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </Form>
        </Col>
      </Card>
    </div>
  );
};

export default Profile;