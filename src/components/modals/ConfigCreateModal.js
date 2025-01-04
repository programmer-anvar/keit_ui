"use client";

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import fetchService from '@/services/fetchSelectServices';
import { enumService } from '@/services/enumController';
import { getOrgId } from '@/utils/authHelper';

const ConfigCreateModal = ({ visible, onCancel, onAdd, pathname }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchSelectData, setFetchSelectData] = useState([]);
    const [selectionValues, setSelectionValues] = useState([]);
    const orgId = getOrgId();

    const selectedType = Form.useWatch('type', form);
    const isFetchSelect = selectedType === "FETCH_SELECT";
    const isSelection = selectedType === "SELECTION";

    // Optimized data fetching using Promise.all
    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchResponse, enumResponse] = await Promise.all([
                fetchService.getAll(orgId, pathname),
                enumService.get()
            ]);

            if (fetchResponse) {
                const updatedFetchData = fetchResponse.map(item => ({
                    label: item.userDefinedColumn,
                    value: item.tableCode,
                    key: item.id
                }));
                setFetchSelectData(updatedFetchData);
            }

            if (enumResponse) {
                const updatedEnumData = enumResponse.map(item => ({
                    label: item.typeName,
                    value: item.typeId,
                    key: item.typeId
                }));
                setSelectionValues(updatedEnumData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchData();
            form.resetFields();
        }
    }, [visible]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onAdd(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Create Configuration"
            open={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    type: 'INPUT',
                    order: 0
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input name!' }]}
                        >
                            <Input placeholder="Input name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="order"
                            label="Order"
                        >
                            <Input type="number" placeholder="Input order" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Please select type!' }]}
                        >
                            <Select
                                placeholder="Select type"
                                options={[
                                    { label: 'Input', value: 'INPUT' },
                                    { label: 'Selection', value: 'SELECTION' },
                                    { label: 'Fetch Select', value: 'FETCH_SELECT' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {isFetchSelect && (
                            <Form.Item
                                name="fetchId"
                                label="Select Fetch Select"
                                rules={[{ required: true, message: 'Please select a fetch select!' }]}
                            >
                                <Select
                                    placeholder="Select fetch select"
                                    options={fetchSelectData}
                                />
                            </Form.Item>
                        )}
                        {isSelection && (
                            <Form.Item
                                name="selectionId"
                                label="Selection Name"
                                rules={[{ required: true, message: 'Please select a selection name!' }]}
                            >
                                <Select
                                    placeholder="Select selection name"
                                    options={selectionValues}
                                />
                            </Form.Item>
                        )}
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ConfigCreateModal;
