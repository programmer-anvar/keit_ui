"use client";

import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space, Button } from 'antd';

const MatrixModal = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();
    const isEditMode = !!initialValues;

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    name: initialValues.name,
                    unit: initialValues.unit,
                    columnOrder: initialValues.columnOrder,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={isEditMode ? "Edit Matrix Column" : "Add Matrix Column"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    {isEditMode ? "Update" : "Create"}
                </Button>
            ]}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    columnOrder: 0,
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please input the name" }]}
                >
                    <Input placeholder="Enter name" />
                </Form.Item>

                <Form.Item
                    name="unit"
                    label="Unit"
                >
                    <Input placeholder="Enter unit" />
                </Form.Item>

                <Form.Item
                    name="columnOrder"
                    label="Order"
                    rules={[{ required: true, message: "Please input the order" }]}
                >
                    <InputNumber 
                        min={0} 
                        placeholder="Enter order"
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MatrixModal;
