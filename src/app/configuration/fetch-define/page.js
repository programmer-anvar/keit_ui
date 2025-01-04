"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import fetchService from "@/services/fetchSelectServices";
import { FetchSelectColumns } from "@/constants/common";
import dynamic from 'next/dynamic';
import useKNotification from "@/hooks/useKNotification";

const KTable = dynamic(() => import('@/components/table/KTable'), {
    ssr: false,
});

const FetchDefinePage = () => {
    const { 
        pageLoading = false 
    } = useSelector(selectLayoutState);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [tableParams, setTableParams] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 0,
        sortField: null,
        sortOrder: null
    });
    const { SUCCESS, ERROR, contextHolder } = useKNotification();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchService.getAll();
            if (response.success) {
                const formattedData = Array.isArray(response.data) ? response.data : [];
                setData(formattedData.sort((a, b) => b.id - a.id));
                setTableParams(prev => ({
                    ...prev,
                    totalElements: formattedData.length
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            ERROR('Failed to fetch fetch defines');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setLoading(true);
        window.location.assign('/configuration/fetch-define/create');
    };

    const handleEdit = (id) => {
        setLoading(true);
        window.location.assign(`/configuration/fetch-define/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await fetchService.delete(id);
            fetchData();
            // SUCCESS('Fetch define deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
            ERROR('Failed to delete fetch define');
        } finally {
            setLoading(false);
        }
    };

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
        const sortedData = getSortedData(data);
        const startIndex = tableParams.pageNumber * tableParams.pageSize;
        const endIndex = startIndex + tableParams.pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [data, tableParams, getSortedData]);

    return (
        <>
            {contextHolder}
            <KTable
                loading={loading}
                initialColumns={FetchSelectColumns}
                dataSource={getCurrentPageData()}
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}
                size="small"
                tableParams={{
                    ...tableParams,
                    pageNumber: tableParams.pageNumber,
                    totalElements: data.length
                }}
                onTableChange={handleTableChange}
                isAdd={true}
                onAddClick={handleAdd}
                extraTitle="Configuration - Fetch Define"
            />
        </>
    );
};

export default FetchDefinePage;