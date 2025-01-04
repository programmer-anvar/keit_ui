"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import { Tag } from 'antd';
import useKNotification from "@/hooks/useKNotification";
import { enumService } from "@/services/enumController";
import KTable from "@/components/table/KTable";
import { EnumColumns } from "@/constants/common";

const EnumDefinePage = () => {
    const { 
        pageLoading 
    } = useSelector(selectLayoutState);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const [enumTableData, setEnumTableData] = useState([]);
    const [tableParams, setTableParams] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 0,
        sortField: null,
        sortOrder: null
    });

    const fetchData = useCallback(async () => {
        try {
            const response = await enumService.get();
            
            if (response.success) {
                const sortedData = response.data.sort((a, b) => b.typeId - a.typeId);
                const formattedData = sortedData.map(item => {
                    const { typeId, typeName, lists, isDeletable, showName } = item;
                    
                    const listNames = lists.map(list => (
                        <Tag key={list.listId}>{list.showName || list.listName}</Tag>
                    ));
    
                    const allValues = lists.flatMap(list => 
                        list.values.map(value => value.name)
                    );
    
                    const maxVisibleTags = 2;
                    const valueTags = allValues.slice(0, maxVisibleTags).map((val, index) => (
                        <Tag key={index}>{val}</Tag>
                    ));
    
                    if (allValues.length > maxVisibleTags) {
                        valueTags.push(
                            <Tag key="more">+{allValues.length - maxVisibleTags} more</Tag>
                        );
                    }
    
                    return {
                        key: typeId,
                        id: typeId,
                        typeName,
                        showName,
                        listNames,
                        values: valueTags,
                        isDeletable
                    };
                });
                setTableParams(prev => ({
                    ...prev,
                    totalElements: response.data.length
                }));
                setEnumTableData(formattedData);
            }
        } catch (error) {
            ERROR('Failed to fetch enum defines');
            console.error("Error fetching data: ", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []); 

    const handleTableChange = useCallback((pagination, filters, sorter) => {
        setTableParams(prev => ({
            ...prev,
            pageNumber: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: sorter.field,
            sortOrder: sorter.order
        }));
    }, []);

    const getSortedData = useCallback((data) => {
        const { sortField, sortOrder } = tableParams;
        if (!sortField || !sortOrder) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (sortOrder === 'ascend') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
    }, [tableParams]);

    const getCurrentPageData = useCallback(() => {
        const sortedData = getSortedData(enumTableData);
        const { pageNumber, pageSize } = tableParams;
        const startIndex = pageNumber * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [enumTableData, tableParams, getSortedData]);

    const handleAddClick = () => {
        window.location.assign('/configuration/enum-define/create');
    };

    const handleEditClick = async (id) => {
        window.location.assign(`/configuration/enum-define/${id}`);
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await enumService.delete(id);
            if (response.success) {
                SUCCESS('Enum define deleted successfully');
                fetchData();
            } else {
                throw new Error(response.message || 'Failed to delete enum define');
            }
        } catch (error) {
            ERROR('Failed to delete enum define');
        }
    };

    return (
        <>
            {contextHolder}
            <KTable 
                size="small"
                loading={pageLoading}
                rowKey="id"
                initialColumns={EnumColumns}
                dataSource={getCurrentPageData()}
                tableParams={tableParams}
                onTableChange={handleTableChange}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                isAdd={true}
                extraTitle="Configuration - Enum Define"
                isDelete={true}
            />
        </>
    );
};

export default EnumDefinePage;