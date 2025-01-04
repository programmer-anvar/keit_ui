"use client";

import { Card, Form, Input, Select, Spin, Tooltip, Row, Col, Button, Space } from "antd";
import { InfoCircleOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchService from "@/services/fetchSelectServices";
import useKNotification from "@/hooks/useKNotification";
import { getOrgId } from "@/utils/authHelper";

const FetchDefineEditPage = ({ params }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const orgId = getOrgId();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fetchSelectData, setFetchSelectData] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedFilteringColumn, setSelectedFilteringColumn] = useState(null);
    const [filteringTypes, setFilteringTypes] = useState([]);
    const [orderByTypes, setOrderByTypes] = useState([]);
    const [orderingTypes] = useState([
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' }
    ]);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();

    // Initial data loading
    useEffect(() => {
        fetchTableData();
    }, []);

    useEffect(() => {
        if (fetchSelectData.length > 0) {
            fetchItemData();
        }
    }, [fetchSelectData, params.id]);

    const fetchTableData = async () => {
        try {
            setLoading(true);
            const response = await fetchService.getForFetch();
            const tables = response.data.map(table => ({
                label: table.mappedDefineTableShow,
                value: table.tableCode,
                columns: table.selectColumns.map(col => ({
                    label: col.mappedColumn,
                    value: col.mappedColumn,
                    id: col.id
                })),
                filteringTypes: table.filteringType.map(type => ({
                    label: type,
                    value: type
                })),
                orderColumns: table.selectColumns.map(col => ({
                    label: col.mappedColumn,
                    value: col.mappedColumn
                }))
            }));
            setFetchSelectData(tables);
        } catch (error) {
            console.error('Error fetching tables:', error);
            ERROR('Failed to fetch tables');
        } finally {
            setLoading(false);
        }
    };

    const fetchItemData = async () => {
        try {
            setLoading(true);
            const response = await fetchService.getById(params.id);
            if (response.success) {
                const table = fetchSelectData.find(t => t.value === response.data.tableCode);
                console.log(table);
                
                if (table) {
                    // Set table related data
                    setSelectedTable(response.data.tableCode);
                    setSelectedColumns(table.columns || []);
                    setFilteringTypes(table.filteringTypes || []);
                    setOrderByTypes(table.columns || []);
    
                    // Set filtering column if exists
                    if (response.data.filteringColumn) {
                        setSelectedFilteringColumn(response.data.filteringColumn);
                    }
    
                    // Map the response data to match the form structure
                    const mappedData = {
                        tableCode: response.data.tableCode,
                        userDefinedColumn: response.data.userDefinedColumn,
                        mappedColumns: response.data.mappedTables?.selectColumns?.map(col => col.mappedColumn) || response.data.mappedColumns || [],
                        filteringColumn: response.data.filteringColumn,
                        filteringType: response.data.filteringType,
                        filteringValue: response.data.filteringValue,
                        orderBy: response.data.orderBy,
                        orderingType: response.data.orderingType
                    };
    
                    // Set form values
                    form.setFieldsValue(mappedData);
                }
            } else {
                throw new Error(response.message || 'Failed to fetch item');
            }
        } catch (error) {
            ERROR('Failed to fetch item');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (value) => {
        setSelectedTable(value);
        setSelectedFilteringColumn(null);
        
        // Reset all dependent fields
        form.setFieldsValue({
            mappedColumns: [],
            filteringColumn: null,
            filteringType: null,
            filteringValue: null,
            orderBy: null,
            orderingType: null
        });

        // Update options based on selected table
        if (value) {
            const table = fetchSelectData.find(t => t.value === value);
            if (table) {
                setSelectedColumns(table.columns || []);
                setFilteringTypes([]);
                setOrderByTypes(table.columns || []);
            }
        } else {
            // Clear all options if no table selected
            setSelectedColumns([]);
            setFilteringTypes([]);
            setOrderByTypes([]);
        }
    };

    const handleFilteringColumnChange = (value) => {
        setSelectedFilteringColumn(value);
        
        // Reset dependent fields when filtering column changes
        form.setFieldsValue({
            filteringType: null,
            filteringValue: null
        });

        // Update filtering types based on selected table
        if (value && selectedTable) {
            const table = fetchSelectData.find(t => t.value === selectedTable);
            if (table) {
                setFilteringTypes(table.filteringTypes || []);
            }
        } else {
            setFilteringTypes([]);
        }
    };

    const handleOrderByChange = (value) => {
        if (!value) {
            form.setFieldsValue({
                orderingType: null
            });
        }
    };

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (!selectedTable) {
                throw new Error('Please select a table');
            }

            if (values.filteringColumn && (!values.filteringType || !values.filteringValue)) {
                throw new Error('When filtering column is selected, both filtering type and value are required');
            }

            const filteringColumn = selectedColumns.find(col => col.value === values.filteringColumn);

            const definedColumnId = selectedColumns
                .filter(col => values.mappedColumns?.includes(col.value))
                .map(col => col.id);

            const payload = {
                id: parseInt(params.id),
                orgId: orgId,
                tableCode: selectedTable,
                mappedColumns: values.mappedColumns || [],
                definedColumnId: definedColumnId,
                filteringColumn: values.filteringColumn || "",
                filteringType: values.filteringColumn ? values.filteringType : null,
                filteringValue: values.filteringValue ? values.filteringValue.trim() : null,
                filteringId: filteringColumn?.id || 0,
                orderBy: values.orderBy || "",
                orderingType: values.orderingType || "",
                userDefinedColumn: values.userDefinedColumn ? values.userDefinedColumn.trim() : ""
            };

            const response = await fetchService.update(params.id, payload);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update fetch define');
            }

            SUCCESS('Successfully updated fetch define');
            router.push('/configuration/fetch-define');
        } catch (error) {
            console.error('Error updating fetch define:', error);
            ERROR(error.message || 'Failed to update fetch define');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Card
                size="small"
                title="Edit Fetch Define"
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
                <Spin spinning={loading}>
                    <Form
                        size="small"
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        disabled={submitting}
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
                                rules={[{ required: true, message: 'Please enter a custom column name' }]}
                            >
                                <Input placeholder="Enter custom column name" />
                            </Form.Item>
                        </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Form.Item
                                    name="tableCode"
                                    rules={[{ required: true, message: 'Please select a table' }]}
                                    label={
                                        <Tooltip title="Select a table to fetch data from">
                                            <span>Table <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
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
                                    rules={[{ required: true, message: 'Please select at least one column' }]}
                                    label={
                                        <Tooltip title="Select columns to map">
                                            <span>Mapped Columns <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
                                >
                                    <Select
                                        allowClear
                                        mode="multiple"
                                        maxCount={2}
                                        options={selectedColumns}
                                        placeholder="Select columns to map"
                                        disabled={!selectedTable || submitting}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Form.Item
                                    name="filteringColumn"
                                    label={
                                        <Tooltip title="Select column to filter by">
                                            <span>Filter Column <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
                                >
                                    <Select
                                        allowClear
                                        options={selectedColumns}
                                        placeholder="Select filter column"
                                        onChange={handleFilteringColumnChange}
                                        disabled={!selectedTable || submitting}
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
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Form.Item
                                    name="filteringValue"
                                    label={
                                        <Tooltip title="Enter the value to filter by">
                                            <span>Filter Value <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
                                    rules={[
                                        {
                                            required: !!selectedFilteringColumn,
                                            message: 'Please enter a filter value',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter filter value" disabled={!selectedFilteringColumn} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Form.Item
                                    name="orderBy"
                                    label={
                                        <Tooltip title="Select column to order by">
                                            <span>Order By <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
                                >
                                    <Select
                                        allowClear
                                        options={orderByTypes}
                                        placeholder="Select order column"
                                        onChange={handleOrderByChange}
                                        disabled={!selectedTable || submitting}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Form.Item
                                    name="orderingType"
                                    label={
                                        <Tooltip title="Select ordering direction">
                                            <span>Order Direction <InfoCircleOutlined className="text-gray-400" /></span>
                                        </Tooltip>
                                    }
                                >
                                    <Select
                                        allowClear
                                        options={orderingTypes}
                                        placeholder="Select order direction"
                                        disabled={submitting}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Card>
        </>
    );
};

export default FetchDefineEditPage;
