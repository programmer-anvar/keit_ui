import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Card, Row, Col } from 'antd';
import FetchSelect from '../selects/FetchSelect';
import { processFormValues } from '@/utils/formHelpers';
import { COLUMN_TYPES, MODAL_SIZES, FORM_LAYOUTS } from '@/constants/common';

const { Option } = Select;
const { Item: FormItem, useForm } = Form;

const AddItemModal = ({ visible, onCancel, onAdd, headers = [], ERROR }) => {
    const [form] = useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedFetch, setSelectedFetch] = useState({});
    
    const onFinish = async () => {
        setConfirmLoading(true);
        try {
            const values = await form.validateFields();
            const processedValues = processFormValues(values, headers);
            await onAdd(processedValues);
            // form.resetFields();
            // setModalVisible(false)
        } catch (error) {
            console.error('Failed to add item:', error);
            ERROR(error.message || '데이터 추가에 실패했습니다.');
        } finally {
            setConfirmLoading(false);
        }
    };

    const renderInputField = (header) => {
        const commonProps = {
            style: { width: '100%' },
            placeholder: `Enter ${header.name}`
        };
        
        // if (header.name === 'samplingRegNumber') {
        //     commonProps.disabled = true;
        // }

        if (!header.isCreateRequired) {
            return null;
        }

        switch (header.columnType) {
            case COLUMN_TYPES.STRING:
                return <Input {...commonProps} />;
            case COLUMN_TYPES.INTEGER:
            case COLUMN_TYPES.LONG:
            case COLUMN_TYPES.DOUBLE:
                return <Input type="number" {...commonProps} />;
            case COLUMN_TYPES.BOOLEAN:
            case COLUMN_TYPES.SELECTION:
                return (
                    <Select {...commonProps}>
                        {header.selectionValues?.lists.map(group =>
                            group.values.map(option => (
                                <Option key={option.id} value={option.value}>
                                    {option.value}
                                </Option>
                            ))
                        )}
                    </Select>
                );
            case COLUMN_TYPES.FETCH_SELECT:
                return (
                    <FetchSelect
                        selectId={header.id}
                        selectedFetch={selectedFetch}
                        setSelectedFetch={setSelectedFetch}
                        form={form}
                    />
                );
            case COLUMN_TYPES.DATE:
                return <DatePicker {...commonProps} format="YYYY-MM-DD" />;
            default:
                return <Input {...commonProps} />;
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={visible}
            title="Add Item"
            okText="Add"
            cancelText="Cancel"
            onCancel={handleCancel}
            onOk={form.submit}
            confirmLoading={confirmLoading}
            width={MODAL_SIZES.MEDIUM}
            maskClosable={false}
            destroyOnClose
            centered
        >
            <Form
                form={form}
                name="item_add_form"
                layout="horizontal"
                autoComplete="off"
                {...FORM_LAYOUTS}
                onFinish={onFinish}
                style={{ maxWidth: '100%' }}
            >
                <Card bordered={false}>
                    <Row gutter={[16, 0]}>
                        {headers.map((header, index) => (
                            header.isCreateRequired && (
                                <Col key={index} span={12}>
                                    <FormItem
                                        name={header.index}
                                        key={header.name}
                                        label={header.title || header.name}
                                        rules={[{ required: header.required, message: `${header.title || header.name} is required` }]}
                                    >
                                        {renderInputField(header)}
                                    </FormItem>
                                </Col>
                            )
                        ))}
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
};

export default AddItemModal;
