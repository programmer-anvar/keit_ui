"use client";

import React, { useEffect, useState, useMemo, memo, useCallback } from 'react';
import { 
    Table,
    Button, 
    Space, 
    Popconfirm, 
    Skeleton, 
    ConfigProvider,
    Dropdown,
    Empty, 
    Typography, 
    Card
} from 'antd';
import {
    ColumnHeightOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    MergeOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { createStyles } from 'antd-style';
import KTableSetting from './KtableSettings';
import styles from './KTable.module.css';
import { useRouter } from 'next/navigation';

const initTableParams = {
    totalElements: 0,
    pageSize: 10,
    pageNumber: 1,
    order: null,
    field: "",
};

const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
            ${antCls}-table {
                ${antCls}-table-container {
                    ${antCls}-table-body,
                    ${antCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    };
});

const KTable = memo(({ 
    dataSource = [],
    initialColumns = [],
    onEdit, 
    loading, 
    onDeleteClick, 
    onAddClick, 
    rowKey = 'id',
    isAdd = false,
    isUpload = false,
    onEditClick,
    tableParams = initTableParams,
    isSampling = false,
    extraTitle = "",
    selectable = false,
    isNotice = false,
    setLoading,
    onUploadClick,
    isPdf = false,
    isUser = false,
    sortDirections,
    handleExcelDownload,
    selectedRowKeys: propSelectedRowKeys = [],
    onSelectionChange,
    isRead,
    isCreate,
    isUpdate,
    isDelete,
    isDownloadPdf,
    isDownloadExcel,
    onTableChange,
    ...props 
}) => {
    const router = useRouter();
    const customStyle = useStyle();
    
    // States
    const [selectedRowKeys, setSelectedRowKeys] = useState(propSelectedRowKeys);
    const [size, setSize] = useState("small");
    const [columns, setColumns] = useState(initialColumns);
    const [dataSourceState, setDataSourceState] = useState(dataSource);

    // Memoized values
    const enhancedColumns = useMemo(() => {
        const allColumns = initialColumns.map(col => ({
            ...col,
            align: 'center',  
            onCell: (record) => ({
                style: {
                    textAlign: 'center',  
                },
                onDoubleClick: (e) => {
                    e.stopPropagation();
                    if (col.key === 'action') return;
                    onEditClick?.(record.id);
                    }
            })
        }));

        if (onEditClick || onDeleteClick) {
            allColumns.push({
                title: '실행',
                key: 'action',
                fixed: "right",
                width: 120,
                align: 'center',
                render: (_, record) => (
                    <Space size="small">
                        {rowKey === "roleName" && (
                            <Button
                                type='link'
                                icon={<MergeOutlined />}
                                onClick={() => router.push(`/roles/${record.id}`)}
                                style={{ marginRight: '8px' }}
                            >
                                권한할당
                            </Button>
                        )}
                        {onEditClick && (
                            <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => onEditClick(record.id)}
                            >
                                수정
                            </Button>
                        )}
                        {onDeleteClick && (
                            <Popconfirm
                                title="삭제하시겠습니까?"
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={() => onDeleteClick(record.id)}
                            >
                                <Button
                                    type="link"
                                    danger
                                    disabled={record.isDeletable === false}
                                    icon={<DeleteOutlined />}
                                >
                                    삭제
                                </Button>
                            </Popconfirm>
                        )}
                    </Space>
                ),
            });
        }

        return allColumns;
    }, [onEditClick, onDeleteClick, initialColumns]);

    // Memoize pagination settings
    const pagination = useMemo(() => ({
        current: tableParams?.pageNumber + 1,
        pageSize: tableParams?.pageSize || 10,
        total: tableParams?.totalElements || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100']
    }), [tableParams?.pageNumber, tableParams?.pageSize, tableParams?.totalElements]);

    // Handle table changes including sorting
    const handleTableChange = useCallback((pagination, filters, sorter) => {
        if (onTableChange) {
            onTableChange(pagination, filters, sorter);
        }
    }, [onTableChange]);

    // Row selection configuration
    const rowSelection = useMemo(() => 
        selectable ? {
            selectedRowKeys: propSelectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            onSelectionChange?.(selectedKeys, selectedRows);
        },
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record) => ({
            disabled: record.disabled,
                name: record.name,
        })
        } : undefined
    , [selectable, propSelectedRowKeys, onSelectionChange]);

    // Callbacks
    const handleReloadTable = useCallback(() => {
            setColumns(enhancedColumns);
        setSize("small");
    }, [enhancedColumns]);

    const handleColumnWidthChange = useCallback((key, width) => {
        setColumns(prevColumns =>
            prevColumns.map(col => col.key === key ? { ...col, width } : col)
        );
    }, []);

    const handleColumnVisibilityChange = useCallback((keys) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                keys.includes(col.key)
                ? { ...col, hidden: false }
                : { ...col, hidden: true }
            )
        );
    }, []);

    const handleColumnFixedChange = useCallback((key, fixed) => {
        setColumns(prevColumns =>
            prevColumns.map(col => col.key === key ? { ...col, fixed } : col)
        );
    }, []);

    const handleColumnOrderChange = useCallback((newOrder) => {
        setColumns(prevColumns => {
            const orderedColumns = newOrder.map(item => {
                const existingColumn = prevColumns.find(col => col.key === item.key);
                return existingColumn ? { ...existingColumn, ...item } : item;
            });
            return orderedColumns;
        });
    }, []);

    // Effects
    useEffect(() => {
            setColumns(enhancedColumns);
    }, []);

    useEffect(() => {
        if (Array.isArray(propSelectedRowKeys) && 
            JSON.stringify(propSelectedRowKeys) !== JSON.stringify(selectedRowKeys)) {
            setSelectedRowKeys(propSelectedRowKeys);
        }
    }, [propSelectedRowKeys]);

    useEffect(() => {
        setDataSourceState(dataSource);
    }, [dataSource]);



    // Memoized size items
    const sizeItems = useMemo(() => [
        { key: "small", label: <a onClick={() => setSize("small")}>작게</a> },
        { key: "middle", label: <a onClick={() => setSize("middle")}>중간</a> },
        { key: "large", label: <a onClick={() => setSize("large")}>크게</a> },
    ], []);

    // Memoized table header
    const tableHeader = useCallback(() => (
        <ConfigProvider
            theme={{
                components: {
                    Table: { rowSelectedBg: "#fff" },
                    Pagination: {
                        paddingContentVerticalSM: 2,
                        paddingContentHorizontalSM: 4
                    }
                },
            }}
            componentSize={size}
        >
            <Space
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                size={"small"}
            >
                <Typography className={styles.totalCount} size="small">
                    Total: {tableParams?.totalElements || 0}
                </Typography>
                <Space size={"small"}>
                    {/* {isPdf && selectable && handleExcelDownload && (
                        <Button
                            type="primary"
                            size='small'
                            icon={<DownloadOutlined />}
                            onClick={handleExcelDownload}
                        >
                            PDF Download
                        </Button>
                    )}
                    <ReloadOutlined 
                        onClick={handleReloadTable} 
                        style={{ cursor: 'pointer' }} 
                    />
                    <Dropdown
                        trigger={["click"]}
                        placement="bottomLeft"
                        arrow={false}
                        menu={{
                            items: sizeItems,
                            selectable: true,
                            defaultSelectedKeys: [size],
                        }}
                    >
                        <ColumnHeightOutlined style={{ cursor: 'pointer' }} />
                    </Dropdown>
                    <KTableSetting
                        parentColumns={columns}
                        onColumnWidthChange={handleColumnWidthChange}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        onColumnFixedChange={handleColumnFixedChange}
                        onColumnOrderChange={handleColumnOrderChange}
                        onResetTable={handleReloadTable}
                    /> */}
                </Space>
            </Space>
        </ConfigProvider>
    ), [
        isPdf, 
        selectable, 
        handleExcelDownload,
        handleReloadTable, 
        sizeItems, 
        size, 
        columns,
        handleColumnWidthChange,
        handleColumnVisibilityChange,
        handleColumnFixedChange,
        handleColumnOrderChange,
        tableParams?.totalElements
    ]);
    return (
        <Card className={styles.tableWrapper}
            title={extraTitle}
            size='small'
            extra={
                <Space size={"small"}>
                    {isUpload && onUploadClick && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onUploadClick}
                            size="small"
                        >
                            엑셀 업로드
                        </Button>
                    )}
                    {isAdd && onAddClick && (
                        <Button 
                            size="small"
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={onAddClick}
                        >
                            추가
                        </Button>
                    )}
                </Space>
            }
        >
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowSelectedBg: "#fff",
                            padding: size === 'small' ? 4 : 8,
                            paddingContentVerticalSM: 4,
                            paddingContentHorizontalSM: 8,
                            headerBg: '#fafafa',
                            headerColor: 'rgba(0, 0, 0, 0.85)',
                            rowHoverBg: '#f5f5f5',
                            headerSplitColor: '#f0f0f0',
                            borderColor: '#f0f0f0',
                            size: size
                        },
                        Pagination: {
                            paddingContentVerticalSM: 2,
                            paddingContentHorizontalSM: 4,
                            size: size
                        }
                    },
                }}
            >
                <Table 
                    {...props}
                    columns={enhancedColumns}
                    dataSource={dataSourceState}
                    loading={loading}
                    onChange={handleTableChange}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    size={"small"}
                    rowKey={rowKey}
                    className={customStyle.customTable}
                    title={tableHeader}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </ConfigProvider>
        </Card>
    );
});

KTable.displayName = 'KTable';

export default KTable;
