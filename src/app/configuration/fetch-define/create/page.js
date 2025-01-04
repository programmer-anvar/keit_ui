"use client";

import { Card, Form, Input, Select, Spin, Tooltip, Alert, Row, Col, Button, Space } from "antd";
import { InfoCircleOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchService from "@/services/fetchSelectServices";
import useKNotification from "@/hooks/useKNotification";
import { getOrgId } from "@/utils/authHelper";

const FetchDefineCreatePage = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const orgId = getOrgId();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fetchSelectData, setFetchSelectData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedFilteringColumn, setSelectedFilteringColumn] = useState(null);
    const [filteringTypes, setFilteringTypes] = useState([]);
    const [orderByTypes, setOrderByTypes] = useState([]);
    const [orderingTypes, setOrderingTypes] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();

    useEffect(() => {
        fetchTableData();
    }, []);

    useEffect(() => {
        // Reset and disable filtering type and value when filtering column changes
        if (!selectedFilteringColumn) {
            form.setFieldsValue({
                filteringType: null,
                filteringValue: null
            });
        }
    }, [selectedFilteringColumn, form]);

    const fetchTableData = async () => {
        try {
            setLoading(true);
            const response = await fetchService.getForFetch();
            console.log(response);
            if (response.success) {
                const tables = response?.data.map(table => ({
                    label: table.mappedDefineTableShow,
                    value: table.tableCode,
                    columns: table.selectColumns,
                    filteringTypes: table.filteringType.map(type => ({
                        label: type,
                        value: type
                    })),
                    orderColumns: table.orderColumns
                }));
                setFetchSelectData(tables);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            ERROR('Failed to fetch tables');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (value) => {
        form.resetFields(['mappedColumns', 'filteringColumn', 'filteringType', 'filteringValue', 'orderBy', 'orderingType']);
        
        const selected = fetchSelectData.find(table => table.value === value);
        if (selected) {
            setSelectedTable(selected);
            setSelectedType(value);
            
            const mappedColumns = selected.columns.map(col => ({
                label: col.mappedColumnShow || col.mappedColumn,
                value: col.mappedColumn,
                id: col.id,
                type: col.columnType
            }));
            
            setSelectedColumns(mappedColumns);
            setFilteringTypes(selected.filteringTypes);
            setOrderByTypes(mappedColumns);
            setOrderingTypes(selected.orderColumns.map(col => ({
                label: col.orderingTypeShow,
                value: col.orderingType
            })));
        }
    };

    const handleFilteringColumnChange = (value) => {
        setSelectedFilteringColumn(value);
        // Reset dependent fields when parent field is cleared
        if (!value) {
            form.setFieldsValue({
                filteringType: null,
                filteringValue: null
            });
        }
        // Update filtering types based on selected column
        if (value && selectedTable) {
            const table = fetchSelectData.find(t => t.value === selectedTable);
            if (table) {
                setFilteringTypes(table.filteringTypes || []);
            }
        } else {
            setFilteringTypes([]);
        }
    };

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (!selectedTable) {
                throw new Error('Please select a table');
            }

            // Validate filtering fields only if filtering column is selected
            if (values.filteringColumn && (!values.filteringType || !values.filteringValue)) {
                throw new Error('When filtering column is selected, both filtering type and value are required');
            }

            const filteringColumn = selectedColumns.find(col => col.value === values.filteringColumn);

            const payload = {
                orgId: orgId,
                tableCode: selectedType,
                mappedColumns: Array.isArray(values.mappedColumns) ? values.mappedColumns : [],
                definedColumnId: selectedColumns
                    .filter(col => values.mappedColumns?.includes(col.value))
                    .map(col => col.id),
                filteringColumn: values.filteringColumn || null,
                filteringType: values.filteringType || null,
                filteringValue: values.filteringValue ? values.filteringValue.trim() : null,
                filteringId: filteringColumn?.id || 0,
                orderBy: values.orderBy || "",
                orderingType: values.orderingType || "",
                userDefinedColumn: values.userDefinedColumn ? values.userDefinedColumn.trim() : null
            };

            const response = await fetchService.post(payload);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create fetch define');
            }
            SUCCESS('Fetch define created successfully');
            router.push('/configuration/fetch-define');
        } catch (error) {
            console.error('Error creating fetch define:', error);
            ERROR(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="small" tip="Loading..." />
            </div>
        );
    }

    return (
        <div className="p-4">
            {contextHolder}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center text-base font-medium">
                        Create Fetch Define
                    </div>
                }
                extra={
                    <Space size={"small"}>
                        <Button 
                            type="primary" 
                            onClick={onFinish}
                            size='small'
                            loading={loading}
                        >
                            저장
                        </Button>
                        <Button 
                            size='small'
                            onClick={() => router.push('/configuration/fetch-define')}
                        >
                            닫기
                        </Button>
                    </Space>
                }
            >

                
                <Form
                    id="fetchDefineForm"
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    disabled={submitting}
                    size="small"
                    className="max-w-6xl mx-auto"
                >
                    <Row gutter={[16, 16]}>
                        
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="userDefinedColumn"
                                label={
                                    <Tooltip title="Enter a custom name for this column">
                                        <span>Custom Column Name <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a custom column name',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter custom column name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="tableCode"
                                label={
                                    <Tooltip title="Select the table to fetch data from">
                                        <span>Table <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a table',
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    options={fetchSelectData}
                                    placeholder="Select table"
                                    onChange={handleTableChange}
                                    disabled={submitting}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="mappedColumns"
                                label={
                                    <Tooltip title="Select up to 2 columns to map">
                                        <span>Mapped Columns <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                                rules={[
                                    {
                                        required: !!selectedType,
                                        message: 'Please select a table first',
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    mode="multiple"
                                    maxCount={2}
                                    options={selectedColumns}
                                    placeholder="Select columns (max 2)"
                                    disabled={!selectedType || submitting}
                                    notFoundContent={!selectedType ? 'Select a table first' : 'No columns available'}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="filteringColumn"
                                label={
                                    <Tooltip title="Select which column to filter by">
                                        <span>Filter Column <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                            >
                                <Select
                                    allowClear
                                    options={selectedColumns}
                                    placeholder="Select filter column"
                                    onChange={handleFilteringColumnChange}
                                    disabled={!selectedType || submitting}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="filteringType"
                                rules={[
                                    {
                                        required: !!selectedFilteringColumn,
                                        message: 'Please select filtering type',
                                    },
                                ]}
                                label={
                                    <Tooltip title="Select how to filter the data">
                                        <span>Filter Type <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                            >
                                <Select
                                    allowClear
                                    options={filteringTypes}
                                    placeholder="Select filter type"
                                    disabled={!selectedFilteringColumn || submitting}
                                    showSearch
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="filteringValue"
                                rules={[
                                    {
                                        required: !!selectedFilteringColumn,
                                        message: 'Please enter filtering value',
                                    },
                                ]}
                                label={
                                    <Tooltip title="Enter the value to filter by">
                                        <span>Filter Value <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                            >
                                <Input 
                                    placeholder="Enter filter value" 
                                    disabled={!selectedFilteringColumn} 
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="orderBy"
                                label={
                                    <Tooltip title="Select which column to order by">
                                        <span>Order By <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                            >
                                <Select
                                    allowClear
                                    options={[
                                        {
                                            label: "Created At",
                                            value: "created_at"
                                        },
                                        {
                                            label: "Updated At",
                                            value: "updated_at"
                                        }
                                    ]}
                                    placeholder="Select order column"   
                                    disabled={!selectedType || submitting}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="orderingType"
                                label={
                                    <Tooltip title="Select the order direction">
                                        <span>Order Direction <InfoCircleOutlined className="text-gray-400" /></span>
                                    </Tooltip>
                                }
                            >
                                <Select
                                    allowClear
                                    options={orderingTypes}
                                    placeholder="Select order direction"
                                    disabled={!selectedType || submitting}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};

export default FetchDefineCreatePage;