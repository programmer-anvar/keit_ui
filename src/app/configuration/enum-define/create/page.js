"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Popconfirm, Divider, Typography, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'; // Import validation
import useKNotification from '@/hooks/useKNotification';
import { useParams, useRouter } from 'next/navigation';
import { enumService } from '@/services/enumController';
import { getOrgId } from '@/utils/authHelper';

const EnumCreatePage = () => {
    const orgId = getOrgId();
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const [enumData, setEnumData] = useState({
        lists: [
            {
                listId: uuidv4(),
                listName: '',
                listShowName: '',
                values: [
                    {
                        id: uuidv4(),
                        name: '',
                        value: ''
                    }
                ]
            }
        ]
    });
    
    const addList = () => {
        const newList = {
            listId: uuidv4(),
            listName: '',
            listShowName: '',
            isDeletable: true,
            values: [
                {
                    id: uuidv4(),
                    name: '',
                    value: '',
                    isDeletable: true
                }
            ]
        };
        setEnumData(prev => ({
            ...prev,
            lists: [...prev.lists, newList]
        }));
    };

    const handleListChange = (listId, key, value) => {
        setEnumData(prev => ({
            ...prev,
            lists: prev.lists.map(list => list.listId === listId ? { ...list, [key]: value } : list)
        }));
    };

    const handleTypeNameChange = (e) => {
        setEnumData(prev => ({ ...prev, typeName: e.target.value }));
    };

    const addValue = (listId) => {
        const newValue = { id: uuidv4(), name: '', value: '', isDeletable: true };
        setEnumData(prev => ({
            ...prev,
            lists: prev.lists.map(list => 
                list.listId === listId ? { ...list, values: [...list.values, newValue] } : list
            )
        }));
    };

    const handleValueChange = (listId, valueId, key, value) => {
        setEnumData(prev => ({
            ...prev,
            lists: prev.lists.map(list => 
                list.listId === listId ? {
                    ...list,
                    values: list.values.map(val => val.id === valueId ? { ...val, [key]: value } : val)
                } : list
            )
        }));
    };

    const handleValidation = (formValues) => {
        if (enumData.lists.length === 0) {
            throw new Error('Enum should have at least one list');
        }

        enumData.lists.forEach(list => {
            if (list.values.length === 0) {
                throw new Error('list should have at least one value');
            }
        });

        if (formValues.typeName === "" || formValues.typeName === null || formValues.typeName === undefined) {
            throw new Error("Type Name shouldn't be empty");
        }

        if (enumData.lists.some(l => l.listName === "")) {
            throw new Error("List Name shouldn't be empty");
        }

        if (enumData.lists.some(l => l.values.some(v => v.value === ""))) {
            throw new Error("Value shouldn't be empty");
        }
    }

    const onSubmit = async () => {
        setLoading(true);
        try {
            const formValues = await form.getFieldsValue();
            handleValidation(formValues);

            const payload = {
                showName: formValues.showName?.trim(),
                typeName: formValues.typeName,
                isVisible: true,
                lines: enumData.lists.map(list => ({
                    showName: list?.listShowName?.trim(),
                    listName: list.listName,
                    isVisible: true,
                    values: list.values.map(value => ({
                        name: value.name.trim(),
                        value: value.value,
                        isVisible: true
                    }))
                }))
            };
            
            const response = await enumService.post(payload, orgId);
            
            if (response.success) {
                router.push('/configuration/enum-define');
                SUCCESS('Enum updated successfully');
            } else {
                throw new Error(response.message || 'Failed to update enum');
            }
    
        } catch (error) {
            ERROR(error.message || 'Failed to update enum');
        } finally {
            setLoading(false);
        }
    };

    const deleteList = async(listId) => {
        try {
            setEnumData(prev => ({
                ...prev,
                lists: prev.lists.filter(list => list.listId !== listId)
            }));
        } catch (error) {
            ERROR(error.message || 'Failed to delete list');
        }
    };

    const deleteValue = async(listId, valueId) => {
        try {
            setEnumData(prev => ({
                ...prev,
                lists: prev.lists.map(list => 
                    list.listId === listId ? { ...list, values: list.values.filter(value => value.id !== valueId) } : list
                )
            }));
        } catch (error) {
            ERROR(error.message || 'Failed to delete value');
        }
    };

    return (
        <Card 
            title="Create Enum" 
            size='small'
            extra={
                <Space size={"small"}>
                    <Button 
                        type="primary" 
                        onClick={onSubmit}
                        size='small'
                        loading={loading}
                    >
                        저장
                    </Button>
                    <Button 
                        size='small'
                        onClick={() => router.push('/configuration/enum-define')}
                    >
                        닫기
                    </Button>
                </Space>
            }
        >
            {contextHolder}
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onSubmit} 
                size='small'
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Enum Show Name" name="showName">
                            <Input value={enumData.showName} onChange={handleTypeNameChange} placeholder="Enter show name"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            label="Enum Type Name" 
                            name="typeName"
                            hasFeedback
                            rules={[
                                { required: true, message: 'Type name is required' },
                                {
                                    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                                    message: 'Type name should start with a letter and contain only letters, numbers, and underscores'
                                }
                            ]}
                        >
                            <Input 
                                value={enumData.typeName} 
                                onChange={handleTypeNameChange} 
                                placeholder="Enter type name"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {enumData.lists.map((list, index) => (
                    <div key={list.listId}>
                        <Typography.Title level={4}>List {index + 1}</Typography.Title>

                        <Row gutter={16} margin={0}>
                            <Col span={10}>
                                <Input 
                                    value={list.listShowName} 
                                    onChange={e => handleListChange(list.listId, 'listShowName', e.target.value)} 
                                    placeholder="List Display Name" 
                                />
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    style={{ width: '100%', marginBottom: 0 }}
                                    name={`listName-${list.listId}`}
                                    initialValue={list.listName}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'List name is required' },
                                        { validator: async (_, value) => {
                                            if (enumData.lists.some(l => l.listName === value && l.listId !== list.listId)) {
                                                throw new Error('List name should be unique');
                                            }
                                        }},
                                        {
                                            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                                            message: 'List name should start with a letter and contain only letters, numbers, and underscores'
                                        }
                                    ]}
                                >
                                    <Input
                                        value={list.listName} 
                                        onChange={e => handleListChange(list.listId, 'listName', e.target.value)} 
                                        placeholder="List Name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Popconfirm
                                    title="Are you sure delete this list?"
                                    onConfirm={() => deleteList(list.listId)}
                                    okText="확인"
                                    cancelText="취소"
                                >
                                    <Button 
                                        icon={<DeleteOutlined />} 
                                        danger 
                                        type='link' 
                                        size='small'
                                    >
                                        Delete List
                                    </Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                        <Divider orientation="left" >
                            Values
                        </Divider>
                        {list.values.map((value) => (
                            <Row key={value.id} gutter={16} style={{ marginTop: 10 }}>
                                <Col span={10}>
                                    <Input 
                                        value={value.name}
                                        onChange={e => handleValueChange(list.listId, value.id, 'name', e.target.value)}
                                        placeholder="Show Name" />
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        name={`value-${list.listId}-${value.id}`}
                                        initialValue={value.value}
                                        rules={[
                                            { required: true, message: 'DB Name is required' },
                                            {
                                                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                                                message: 'DB Name should start with a letter and contain only letters, numbers, and underscores'
                                            },
                                            { validator: async (rule, inputValue) => {
                                                const trimmedValue = inputValue?.trim();
                                                
                                                if (!trimmedValue) return;

                                                const allNames = enumData.lists.flatMap(l => 
                                                    l.values
                                                        .filter(v => v.id !== value.id)
                                                        .map(v => v.value?.trim())
                                                );
                                                
                                                const duplicateCount = allNames.filter(n => n === trimmedValue).length;
                                                
                                                if (duplicateCount > 0) {
                                                    throw new Error('DB Name must be unique across all lists');
                                                }
                                            }}
                                        ]}
                                    >
                                        <Input
                                            value={value.value}
                                            onChange={e => handleValueChange(list.listId, value.id, 'value', e.target.value)}
                                            placeholder="DB Name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Popconfirm
                                        title="Are you sure delete this value?"
                                        onConfirm={() => deleteValue(list.listId, value.id)}
                                        okText="확인"
                                        cancelText="취소"
                                        size='small'
                                    >
                                        <Button 
                                            icon={<DeleteOutlined />} 
                                            danger 
                                            type='link' 
                                            size='small'
                                            style={{ margin: 0 }}
                                        >
                                            Delete Value
                                        </Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                        ))}
                        <Button align="center" type="dashed" onClick={() => addValue(list.listId)} icon={<PlusOutlined />} style={{ marginTop: 10 }} >
                            Add Value
                        </Button>
                        <Divider style={{ margin: '15px 0' }}/>
                    </div>
                ))}
                <div style={{ textAlign: 'center' }}>
                    <Button align="center" type="dashed" onClick={addList} icon={<PlusOutlined />}>
                        Add List
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default EnumCreatePage;
