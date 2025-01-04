import React, { useState } from 'react';
import { Modal, Form, Input, notification, Row, Col, Select } from 'antd';
import { processFormValues } from '@/utils/formHelpers';
import { CompanyTableColumns } from '@/constants/common';
import SelectionInputs from '../inputs/SelectionInputs';
import { getAuthState } from '@/utils/authHelper';

const { Item: FormItem, useForm } = Form;

const initialSelectionValue = { name: '', value: '' }

const CompanyAddModal = ({ visible, setModalVisible, onCancel, onAdd, headers, title, hasAddEnum }) => {
    const [form] = useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectionValues, setSelectionValues] = useState([initialSelectionValue]);
   
    const onFinish = async () => {
        setConfirmLoading(true);
        try {
            const values = await form.validateFields();
            // const processedValues = processFormValues(values, CompanyTableColumns);
            console.log(values);
            
            await onAdd(values);
            form.resetFields();
            setModalVisible(false);
            // notification.success({
            //     message: 'Success',
            //     description: 'Company added successfully',
            //     placement: 'topRight',
            // });
        } catch (error) {
            console.error('Failed to add company:', error);
            // notification.error({
            //     message: 'Error',
            //     description: error.message || 'Failed to add company',
            //     placement: 'topRight',
            // });
        } finally {
            setConfirmLoading(false);
        }
    };

    const renderInputField = (column) => {
        return (
            <FormItem
                key={column.id}
                name={column.dataIndex}
                label={column.title}
                rules={[{ required: column.isRequired, message: `Please enter ${column.title}` }]}
            >
                <Input placeholder={`Enter ${column.dataIndex}`} />
            </FormItem>
        );
    };

    const handleAddSelection = () => {
        setSelectionValues([...selectionValues, { name: '', value: '' }]);
    };

    return (
        <Modal
            open={visible}
            title={title || 'Add Company'}
            onCancel={onCancel}
            onOk={onFinish}
            confirmLoading={confirmLoading}
            width={800}
        >
            <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Row gutter={16}>
                    {headers.map((column, index) => (
                        column.isCreateRequired && (
                            <Col span={12} key={index}>
                                {renderInputField(column)}
                            </Col>
                        )
                    ))}

                </Row>

                {hasAddEnum && (
                    <SelectionInputs 
                        selectedType="SELECTION"
                        selectionValues={selectionValues}
                        setSelectionValues={setSelectionValues}
                        handleAddSelection={handleAddSelection} 
                        title="Add Position Inputs"
                    />
                )}
            </Form>
        </Modal>
    );
};

export default CompanyAddModal;
