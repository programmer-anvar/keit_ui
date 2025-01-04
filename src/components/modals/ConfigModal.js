"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Form, Input, Select, Row, Col, Checkbox } from 'antd';
import fetchService from '@/services/fetchSelectServices';
import { enumService } from '@/services/enumController';
import { getOrgId } from '@/utils/authHelper';
import { configTypes, filteringTypes, orderByTypes, orderingTypes } from '@/components/modal/configTypes';

const ConfigModal = ({ visible, onCancel, onAdd, pathname, mode = "add", initialValues = null, ERROR, SUCCESS }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchSelectData, setFetchSelectData] = useState([]);
    const [selectionValues, setSelectionValues] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState({ fetch: false, selection: false });
    const selectedType = Form.useWatch('type', form);
    const orgId = getOrgId();
    const isEditMode = mode === "edit";
    const modalTitle = isEditMode ? "Edit Configuration" : "Add Configuration";
    const isFieldDisabled = isEditMode && !initialValues?.isDeletable;

    const isFetchSelect = selectedType === "FETCH_SELECT";
    const isSelection = selectedType === "SELECTION";

    const loadFetchOptions = useCallback(async () => {
        if (optionsLoaded.fetch) return;
        setLoading(true);
        try {
            const fetchResponse = await fetchService.getAll(orgId, pathname);
            if (fetchResponse && Array.isArray(fetchResponse.data)) {
                const updatedFetchData = fetchResponse.data.map(item => ({
                    ...item,
                    label: item.userDefinedColumn,
                    value: item.id,
                    key: item.id
                }));
                setFetchSelectData(updatedFetchData);
                setOptionsLoaded(prev => ({ ...prev, fetch: true }));
            }
        } catch (error) {
            ERROR('Error loading fetch options');
        } finally {
            setLoading(false);
        }
    }, [orgId, pathname, optionsLoaded.fetch]);

    const loadSelectionOptions = useCallback(async () => {
        if (optionsLoaded.selection) return;
        setLoading(true);
        try {
            const enumResponse = await enumService.get();
            if (enumResponse && Array.isArray(enumResponse.data)) {
                const updatedEnumData = enumResponse.data.map(item => ({
                    ...item,
                    label: item.typeName,
                    value: item.typeId,
                    key: item.typeId
                }));
                setSelectionValues(updatedEnumData);
                setOptionsLoaded(prev => ({ ...prev, selection: true }));
            }
        } catch (error) {
            ERROR('Error loading selection options');
        } finally {
            setLoading(false);
        }
    }, [optionsLoaded.selection]);

    // Load options when type changes
    useEffect(() => {
        if (!selectedType) return;
        
        const loadOptions = async () => {
            if (selectedType === "FETCH_SELECT" && !optionsLoaded.fetch) {
                await loadFetchOptions();
            } else if (selectedType === "SELECTION" && !optionsLoaded.selection) {
                await loadSelectionOptions();
            }
        };
        loadOptions();
    }, [selectedType, optionsLoaded.fetch, optionsLoaded.selection, loadFetchOptions, loadSelectionOptions]);

    const handleTypeChange = (value) => {
        form.setFieldsValue({
            fetchId: undefined,
            selectionId: undefined
        });
    };

    const resetForm = useCallback(() => {
        form.resetFields();
        setOptionsLoaded({ fetch: false, selection: false });
    }, [form]);

    const loadInitialData = useCallback(async () => {
        if (!isEditMode || !initialValues) return;

        try {
            const { columnType, selectionId, fetchMapping } = initialValues;

            // Set form values first
            form.setFieldsValue({
                name: initialValues.name,
                showName: initialValues.showName,
                type: columnType,
                order: initialValues.columnOrder,
                isCreateRequired: initialValues.isCreateRequired,
                isRequired: initialValues.isRequired,
                organizationId: orgId,
                isDeletable: initialValues.isDeletable,
                ...(columnType === "FETCH_SELECT" && fetchMapping && { fetchId: fetchMapping }),
                ...(columnType === "SELECTION" && selectionId && { selectionId })
            });

        } catch (error) {
            ERROR('Error loading initial data');
        }
    }, [isEditMode, initialValues, form]);

    // Handle modal visibility
    useEffect(() => {
        if (visible) {
            if (isEditMode) {
                loadInitialData();
            } else {
                resetForm();
            }
        }
    }, [visible, isEditMode, loadInitialData, resetForm]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const requestBody = {
                name: values.name,
                columnOrder: values.order,
                isRequired: values.isRequired,
                isCreateRequired: values.isCreateRequired,
                isVisible: true,
                showName: values.showName.trim(),
                columnType: values.type,
                type: values.type,
                organizationId: orgId,
                selectionId: values.type === "SELECTION" ? values.selectionId : null,
                fetchId: values.type === "FETCH_SELECT" ? values.fetchId : null,
                isDeletable: true
            };

            await onAdd(requestBody);
        } catch (error) {
            ERROR('Validation failed');
        }
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <Modal
            title={modalTitle}
            open={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={800}
            size="small"
            destroyOnClose={true}
        >
            <Form
                size='small'
                form={form}
                layout="vertical"
                initialValues={{
                    isCreateRequired: false,
                    isRequired: false
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="showName"
                            label="Show Name"
                            rules={[{ required: true, message: 'Please input show name' }]}
                        >
                            <Input placeholder="Enter show name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="DB Name"
                            rules={[
                                { required: true, message: 'Please input name' },
                                {
                                    pattern: /^[a-zA-Z]+$/,
                                    message: 'Name must contain only English letters without spaces, numbers, or special characters!',
                                },
                            ]}
                        >
                            <Input 
                                placeholder="Enter name" 
                                disabled={isFieldDisabled}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Please select type' }]}
                        >
                            <Select
                                allowClear
                                placeholder="Select type"
                                onChange={handleTypeChange}
                                options={configTypes}
                                disabled={isFieldDisabled}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="order"
                            label="Order"
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Please input order' 
                                },
                                {
                                    pattern: /^(0|[1-9][0-9]*)$/,
                                    message: 'Order must be a non-negative number!',
                                },
                            ]}
                        >
                            <Input 
                                type="number" 
                                placeholder="Enter order" 
                                 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {isFetchSelect && (
                    <Form.Item
                        key="fetchSelect"
                        name="fetchId"
                        label="Fetch Select"
                        rules={[{ required: true, message: 'Please select fetch' }]}
                    >
                        <Select
                            placeholder="Select fetch"
                            loading={loading}
                            options={fetchSelectData}
                            disabled={isFieldDisabled}
                        />
                    </Form.Item>
                )}

                {isSelection && (
                    <Form.Item
                        key="selection"
                        name="selectionId"
                        label="Selection"
                        rules={[{ required: true, message: 'Please select enum' }]}
                    >
                        <Select
                            placeholder="Select enum"
                            loading={loading}
                            options={selectionValues}
                            disabled={true}
                        />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="isCreateRequired"
                            valuePropName="checked"
                        >
                            <Checkbox  >Is Create Required</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="isRequired"
                            valuePropName="checked"
                        >
                            <Checkbox  >Is Required</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ConfigModal;
