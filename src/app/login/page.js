'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Space, Card, Checkbox, Spin } from 'antd';
import useAuthHandler from '@/hooks/useAuthHandler';
import Image from 'next/image';
import Layout from 'antd/es/layout/layout';

import logo from "../../../public/assets/logo-01-u.png";

import "../globals.css"

const { Item } = Form;

const Login = () => {
    const { handleLogin, loading, error } = useAuthHandler();
    const [loadingFetch, setLoadingFetch] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingFetch(true);
            // Simulate API call with a timeout
            await new Promise((resolve) => setTimeout(resolve, 200));
            setLoadingFetch(false); // Set loading to false when data is fetched
        };

        fetchData();
    }, []);

    const onFinish = (values) => {
        handleLogin(values.username, values.password);
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            {
                loadingFetch ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh"
                    }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Space
                        direction="vertical"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "100px"
                        }}
                    >
                        <Image 
                            alt="logo" 
                            src={logo} 
                            height={150} 
                            width={300} 
                            priority={true}
                        />

                        <Card
                            styles={{
                                body: {
                                width: 400,
                                background: "#FAFAFA",
                                },
                            }}
                        >
                            <Form
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                labelCol={{
                                    flex: "100px",
                                }}
                                labelAlign="right"
                                labelWrap
                                wrapperCol={{
                                    flex: 1,
                                }}
                            >
                                <Item
                                    label="사용자 이름"
                                    name="username"
                                    rules={[
                                        {
                                        required: true,
                                        message: "사용자 이름을 입력하세요!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Item>
                                <Item
                                    label="비밀번호"
                                    name="password"
                                    rules={[
                                        {
                                        required: true,
                                        message: "비밀번호를 입력하세요!",
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Item>
                                <Item name="remember" valuePropName="checked">
                                    <Checkbox>기억하기</Checkbox>
                                </Item>
                                <Item>
                                    <Button type="primary" htmlType="submit" block loading={loading}>
                                        {loading ? '로그인 중...' : '로그인'}
                                    </Button>
                                </Item>
                                {error && <Alert message={error} type="error" showIcon />}
                            </Form>
                        </Card>
                    </Space>
                )
            }
        </Layout>
    );
};

export default Login;
