import {
    BorderLeftOutlined,
    BorderRightOutlined,
    BorderlessTableOutlined,
    HolderOutlined,
    ReloadOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Popover, Radio, Slider, Space, Table } from "antd";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";

// Context to manage sortable rows
const RowContext = React.createContext({});

// Drag handle component
const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{
                cursor: "move",
            }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

// Row component with sortable functionality
const Row = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props["data-row-key"],
    });

    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging
            ? {
                position: "relative",
                zIndex: 9999,
            }
            : {}),
    };

    const contextValue = useMemo(
        () => ({
            setActivatorNodeRef,
            listeners,
        }),
        [setActivatorNodeRef, listeners]
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...props}
            />
        </RowContext.Provider>
    );
};

const KTableSetting = ({
    parentColumns = [],
    onColumnWidthChange,
    onColumnVisibilityChange,
    onColumnFixedChange,
    onColumnOrderChange,
    onResetTable,
}) => {
    const [open, setOpen] = useState(false);
    const [parentData, setParentData] = useState([]);

    // Process parent columns with proper key handling
    useEffect(() => {
        if (Array.isArray(parentColumns)) {
            const processedData = parentColumns.map((item) => {
                // Ensure each column has a unique key
                const key = item.key || item.dataIndex || `col-${Math.random().toString(36).substr(2, 9)}`;
                return {
                    key,
                    colName: item.title || '',
                    width: parseInt(item.width) || 100,
                    fixed: item.fixed || '',
                    hidden: item.hidden || false,
                    dataIndex: item.dataIndex,
                    render: item.render,
                };
            });
            setParentData(processedData);
        }
    }, [parentColumns]);

    const handleSelectAllColumns = (checked) => {
        if (!Array.isArray(parentData)) return;
        const selectedKeys = checked ? parentData.map((item) => item.key) : [];
        onColumnVisibilityChange?.(selectedKeys);
    };

    const tableRowSelection = {
        selectedRowKeys: parentData.filter((item) => !item.hidden).map((item) => item.key),
        onChange: (selectedRowKeys) => {
            onColumnVisibilityChange?.(selectedRowKeys);
        },
    };

    const tableTitle = () => {
        const selectedCount = parentData.filter((item) => !item.hidden).length;
        const indeterminate = selectedCount > 0 && selectedCount < parentData.length;

        return (
            <Space
                style={{
                    background: "#fff",
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                    width: "100%",
                    padding: "0 8px",
                }}
            >
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={(e) => handleSelectAllColumns(e.target.checked)}
                    checked={selectedCount === parentData.length}
                >
                    전체 선택
                </Checkbox>
                <Button 
                    icon={<ReloadOutlined />} 
                    onClick={onResetTable}
                    size="small"
                >
                    초기화
                </Button>
            </Space>
        );
    };

    const tableExpandable = {
        expandedRowRender: (record) => (
            <div style={{ margin: 0, padding: "0 8px" }}>
                <div style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>컬럼 너비</div>
                <Slider
                    min={50}
                    max={500}
                    value={record.width}
                    onChange={(value) => {
                        onColumnWidthChange?.(record.key, value);
                    }}
                />
            </div>
        ),
    };

    const columns = [
        {
            key: "sort",
            align: "center",
            width: 50,
            render: () => <DragHandle />,
        },
        Table.EXPAND_COLUMN,
        Table.SELECTION_COLUMN,
        {
            key: "colName",
            dataIndex: "colName",
            title: "컬럼명",
            width: 200,
            ellipsis: true,
        },
        {
            key: "action",
            title: "고정",
            width: 110,
            align: "center",
            render: (_, record) => (
                <Radio.Group
                    onChange={(e) => onColumnFixedChange?.(record.key, e.target.value)}
                    value={record.fixed}
                    size="small"
                    style={{ display: 'flex', gap: '0' }}
                >
                    <Radio.Button value="left" style={{ borderRight: 0 }}>
                        <BorderLeftOutlined />
                    </Radio.Button>
                    <Radio.Button value="" style={{ borderLeft: 0, borderRight: 0 }}>
                        <BorderlessTableOutlined />
                    </Radio.Button>
                    <Radio.Button value="right" style={{ borderLeft: 0 }}>
                        <BorderRightOutlined />
                    </Radio.Button>
                </Radio.Group>
            ),
        },
    ];

    const onDragEnd = ({ active, over }) => {
        if (active?.id !== over?.id) {
            setParentData((prevState) => {
                const activeIndex = prevState.findIndex((i) => i.key === active.id);
                const overIndex = prevState.findIndex((i) => i.key === over.id);
                
                if (activeIndex === -1 || overIndex === -1) return prevState;
                
                const newData = arrayMove(prevState, activeIndex, overIndex);
                onColumnOrderChange?.(newData);
                return newData;
            });
        }
    };

    return (
        <Popover
            
            content={
                <div style={{ width: 500 }}>
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                            items={parentData.map((i) => i.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Table: {
                                            headerBg: '#fafafa',
                                            headerColor: 'rgba(0, 0, 0, 0.85)',
                                            rowHoverBg: '#f5f5f5',
                                            headerSplitColor: '#f0f0f0',
                                            borderColor: '#f0f0f0',
                                            padding: 4,
                                            paddingContentVerticalSM: 4,
                                            paddingContentHorizontalSM: 8,
                                        }
                                    }
                                }}
                            >
                                <Table
                                    title={tableTitle}
                                    dataSource={parentData}
                                    columns={columns}
                                    expandable={tableExpandable}
                                    rowSelection={tableRowSelection}
                                    bordered
                                    pagination={false}
                                    showHeader={false}
                                    scroll={{ y: 300 }}
                                    rowKey="key"
                                    size="small"
                                    components={{
                                        body: {
                                            row: Row,
                                        },
                                    }}
                                />
                            </ConfigProvider>
                        </SortableContext>
                    </DndContext>
                </div>
            }
            title={<div style={{ fontSize: '13px', fontWeight: 500 }}>테이블 설정</div>}
            trigger="click"
            placement="bottomLeft"
            arrow={false}
            open={open}
            style={{ padding: 0 }}
            onOpenChange={setOpen}
        >
            <SettingOutlined style={{ cursor: 'pointer' }} />
        </Popover>
    );
};

export default React.memo(KTableSetting);
