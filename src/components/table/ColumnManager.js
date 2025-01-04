import React from 'react';
import { Space, Dropdown, ConfigProvider } from 'antd';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import KTableSetting from './KtableSettings';

const ColumnManager = ({
    columns,
    onColumnWidthChange,
    onColumnVisibilityChange,
    onColumnFixedChange,
    onColumnOrderChange,
    handleReloadTable,
    size,
    setSize,
}) => {
    const sizeItems = [
        { key: "small", label: <a onClick={() => setSize("small")}>Small</a> },
        { key: "middle", label: <a onClick={() => setSize("middle")}>Middle</a> },
        { key: "large", label: <a onClick={() => setSize("large")}>Large</a> },
    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: { rowSelectedBg: "#fff" },
                },
            }}
        >
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
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
                    <ColumnHeightOutlined style={{ cursor: "pointer" }} />
                </Dropdown>
                <KTableSetting
                    parentColumns={columns}
                    onColumnWidthChange={onColumnWidthChange}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                    onColumnFixedChange={onColumnFixedChange}
                    onColumnOrderChange={onColumnOrderChange}
                    onResetTable={handleReloadTable}
                />
                <ReloadOutlined 
                    onClick={handleReloadTable} 
                    style={{ cursor: "pointer", marginLeft: 8 }} 
                />
            </Space>
        </ConfigProvider>
    );
};

export default React.memo(ColumnManager);
