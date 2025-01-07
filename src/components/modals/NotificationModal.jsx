import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Upload, Switch, DatePicker, Select, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { NotificationService } from '@/services/notificationController';
import { MODAL_SIZES } from '@/constants/common';
const { Title } = Typography;
const { useForm } = Form;
const NotificationModal = ({ visible, onCancel }) => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [allUserIds, setAllUserIds] = useState([]);
    const handleAllUsersChange = (checked) => {
        setAllUsers(checked);
        if (checked) {
            form.setFieldsValue({ users: [] });
        }
    };
    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
        form.setFieldsValue({ upload: fileList });
    };
    const handleSubmit = async () => {
        window.location.reload(false)
        try {
            const values = await form.validateFields();
            const requestData = new FormData();

    
            requestData.append("title", values.title);
            requestData.append("text", values.description);
            requestData.append("userIds", allUsers ? allUserIds : values.users || []);
    
            if (fileList.length > 0) {
                fileList.forEach(file => {
                    requestData.append("file", file.originFileObj);  
                });
            }
    
            setLoading(true);
            const response = await NotificationService.createValue(requestData);
    
            if (response.success) {
                onCancel();
                console.log("Notification sent successfully!");
            }
        } catch (error) {
            console.error('Error while sending notification:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };
    const handleSelectUser = async () => {
        try {
            const pageSize = { id: 1, page: 0, size: 20, search: '' };
            setLoading(true);
            const responseSelect = await NotificationService.getSelectedUser(pageSize);
            if (responseSelect.success) {
                const users = responseSelect.data.documentLines.map(user => ({
                    label: user.username,
                    value: user.id,
                }));
                
                setUserOptions(users);
                setAllUserIds(users.map(user => user.value));
            }
        } catch (error) {
            console.error('Error while fetching users:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        handleSelectUser();
    }, []);

    return (
        <Modal
            open={visible}
            title="Add Item"
            okText="Add"
            cancelText="Cancel"
            getContainer={false}
            onCancel={handleCancel}
            onOk={form.submit}
            confirmLoading={loading}
            width={MODAL_SIZES.MEDIUM}
            maskClosable={false}
            destroyOnClose
            centered
        >
            <Form
                form={form}
                name="form_name"
                layout="vertical"
                style={{ maxWidth: '100%' }}
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: false, message: 'Please enter the notification title!' }]}
                        >
                            <Input placeholder="Enter title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="upload" label="Upload">
                            <Upload
                                name="logo"
                                listType="picture"
                                fileList={fileList}
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: false, message: 'Please enter the notification description!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>
              
                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={4}>Select User</Title>
                        <Form.Item name="users"  style={{ marginBottom: 0 }}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                disabled={allUsers}
                                options={userOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label="All Users">
                            <Switch checked={allUsers} onChange={handleAllUsersChange} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default NotificationModal;