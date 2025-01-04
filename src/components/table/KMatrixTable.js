import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import styles from './KMatrixTable.module.css';

const KMatrixTable = ({ columns = [], dataSource = [], onDataChange }) => {
    const [data, setData] = useState([]);
    
    
    useEffect(() => {
        // Add special rows for average and median
        const specialRows = ['average', 'median'].map(type => ({
            key: type,
            rowNum: type === 'average' ? '평균' : '중간',
            ...columns.reduce((acc, col) => {
                acc[col.dataIndex] = '';
                return acc;
            }, {})
        }));

        setData([...dataSource, ...specialRows]);
    }, [columns, dataSource]);

    const handleCellChange = (value, record, dataIndex) => {
        const newData = data.map(item => {
            if (item.key === record.key) {
                return { ...item, [dataIndex]: value };
            }
            return item;
        });
        setData(newData);
        const changedCell = {
            columnId: dataIndex,
            value: value,
            rowNumber: record.rowNum,
            rowKey: record.key,
            [dataIndex]: value
        };
        onDataChange && onDataChange(changedCell, newData);
    };

    const tableColumns = [
        {
            title: '번호',
            dataIndex: 'rowNum',
            key: 'rowNum',
            width: 80,
            fixed: 'left',
            align: 'center',
            className: styles.headerCell,
            render: text => <div className={styles.centerAlign}>{text}</div>
        },
        ...columns.map(col => ({
            ...col,
            title: (
                <div style={{ textAlign: 'center' }}>
                    <div>{col.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{col.unit ? `(${col.unit})` : ''}</div>
                </div>
            ),
            render: (text, record) => {
                const isSpecialRow = record.key === 'average' || record.key === 'median';
                return (
                    <Input
                        type='number'
                        value={text}
                        onChange={e => handleCellChange(e.target.value, record, col.dataIndex)}
                        disabled={isSpecialRow}
                        style={{ textAlign: 'center' }}
                        className={styles.tableInput}
                    />
                );
            },
            className: styles.headerCell
        }))
    ];

    return (
        <div className={styles.tableWrapper}>
            <Table
                columns={tableColumns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                className={styles.matrixTable}
            />
        </div>
    );
};

export default KMatrixTable;