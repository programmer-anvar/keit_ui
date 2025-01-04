import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Skeleton, ConfigProvider, Dropdown, Empty, Card, Typography } from 'antd';
import { ColumnHeightOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import KTableSetting from './KtableSettings';
import styles from './KTable.module.css';
import { useRouter } from 'next/navigation';
import { createStyles } from 'antd-style';

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

const initTableParams = {
    total: 0,
    pageSize: 10,
    current: 1,
    order: null,
    field: "",
};

const KTable = ({ 
    dataSource = [],
    initialColumns = [],
    onEdit, 
    loading, 
    onDeleteClick, 
    onAddClick, 
    rowKey,
    isAdd,
    isUpload,
    onEditClick,
    tableParams = initTableParams,
    isSampling = false,
    extraTitle = "",
    selectable = false,
    isNotice = false,
    setLoading,
    onUploadClick,
    isPdf = false,
    isUser,
    sortDirections,
    handleExcelDownload,
    selectedRowKeys: propSelectedRowKeys = [],
    onSelectionChange,
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState(propSelectedRowKeys);
    const [size, setSize] = useState("small");
    const [columns, setColumns] = useState([]);
    const router = useRouter();
    const {page, responseList = []} = dataSource
    // Transform dataSource for table rows based on documentLines structure
    const formattedDataSource = responseList.map((item, idx) => {
        const rowData = {};
        item.documentLines.forEach((line) => {
            rowData[line.name] = line.value;
            rowData['oneObject'] = line.oneObject; // add extra field if needed
        });
        rowData['key'] = idx; // unique key for each row
        return rowData;
    });

    // Initialize columns based on initialColumns and add action column
    useEffect(() => {
        if (initialColumns.length > 0) {
            const updatedColumns = initialColumns.map((col) => ({
                title: col.name,
                dataIndex: col.name,
                key: col.name,
                type: col.type,
                width: 150, // or other default width
            }));
            setColumns([...updatedColumns, actionColumn]);
        }
        setColumns([...initialColumns, actionColumn]);
    }, [initialColumns]);

    // Action column definition for edit, delete, and pdf download
    const actionColumn = {
        title: "Actions",
        key: "action",
        width: 170,
        fixed: "right",
        render: (_, record) => (
            <Space>
                { onEditClick && (
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => onEditClick(record.key)}
                        size='small'
                    >
                        Edit
                    </Button>
                )}
                <Popconfirm
                    title="Delete"
                    onConfirm={() => onDeleteClick(record.key)}
                    okText="Yes"
                    cancelText="No"
                    placement="topLeft"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size='small'
                    >
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    };

    const handleReloadTable = () => {
        setSize("small");
    };

    const tableHeader = () => {
        const sizeItems = [
            { key: "small", label: <a onClick={() => setSize("small")}>Small</a> },
            { key: "middle", label: <a onClick={() => setSize("middle")}>Middle</a> },
            { key: "large", label: <a onClick={() => setSize("large")}>Large</a> },
        ];

        return (
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowSelectedBg: "#fff",
                        },
                    },
                }}
            >
                <Space
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    {isPdf && selectable && (
                        <Button
                            type="primary"
                            size='small'
                            icon={<DownloadOutlined />}
                            onClick={() => onPdfClick(selectedRowKeys, filename, setLoading, notify, Report, route)}
                        >
                            PDF Download
                        </Button>
                    )}
                    <ReloadOutlined 
                        onClick={handleReloadTable} 
                        style={{ cursor: 'pointer', marginLeft: 8 }} 
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
                    />
                </Space>
            </ConfigProvider>
        );
    };

    return (
        <Card 
            title={
                <Typography>
                    <span style={{ color: "#3388FF", marginInline: 8 }}>
                        {tableParams.total}
                    </span>
                </Typography>
            }
            extra={
                <Space>
                    {isUpload && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onUploadClick}
                        >
                            Upload Excel
                        </Button>
                    )}
                    {isAdd && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
                            Add
                        </Button>
                    )}
                </Space>
            }
        >
            <div className={styles.tableContainer}>
                <Table 
                    dataSource={formattedDataSource} 
                    className={styles.customTable}
                    rowKey="key"
                    title={() => (
                        <Space>
                            <ReloadOutlined 
                                onClick={handleReloadTable} 
                                style={{ cursor: 'pointer', marginLeft: 8 }} 
                            />
                        </Space>
                    )}
                    size={size}
                    loading={loading}
                    bordered
                    sortDirections={sortDirections}
                    locale={{
                        emptyText: loading ? <Skeleton active={true} /> : <Empty />
                    }}
                    scroll={{
                        x: 'max-content',
                        y: 55 * 5,
                    }}
                    columns={columns}
                />
            </div>
        </Card>
    );
};

export default KTable;