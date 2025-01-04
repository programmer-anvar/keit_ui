"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import configController from "@/services/configController";
import KTable from "@/components/table/KTable";
import { usePathname } from "next/navigation";
import ConfigModal from "@/components/modals/ConfigModal";
import { configTableColumns } from "@/constants/common";
import useKNotification from "@/hooks/useKNotification";
import { getOrgId } from "@/utils/authHelper";


const ConfigurationSlugPage = () => {
    const { 
        pageLoading 
    } = useSelector(selectLayoutState);

    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const orgId = getOrgId();
    const [tableParams, setTableParams] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 0,
        sortField: null,
        sortOrder: null
    });

    const pathname = usePathname();

    const resourceKey = useMemo(() => {
        const key = pathname
            .replace("/configuration", "")
            .replace("-define", "")
            .replace(/^\//, "");
        return key === "mobileScale" ? "mobile-scale" : key;
    }, [pathname]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await configController.getAllDefines(resourceKey, {
                page: tableParams.pageNumber, 
                size: 100
            });
            
            if (response?.success) {
                const dataWithKeys = response?.data
                    .sort((a, b) => b.id - a.id)
                    .map((item, index) => ({
                        ...item,
                        key: item.id || `config-${index}`,
                    }));
    
                setTableData(dataWithKeys);
                setTableParams(prev => ({
                    ...prev,
                    totalElements: dataWithKeys.length
                }));
            }
        } catch (error) {
            ERROR('Failed to fetch configuration data');
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [resourceKey, tableParams.pageNumber, ERROR]);

    useEffect(() => {
        fetchData();
    }, [resourceKey]);

    const handleAdd = useCallback(async (values) => {
        try {
            const response = await configController.addDefineColumn(resourceKey, values);
            console.log(response);
            
            if (response.success) {
                setModalVisible(false);
                fetchData();
                SUCCESS("Item Added Successfully");
            } else {
                throw new Error(response.message || "Failed to create configuration");
            }
        } catch (err) {
            console.error("Failed to create configuration:", err);
            ERROR(err.message || "Failed to create configuration");
        }
    }, [resourceKey, ERROR, fetchData]);

    const handleEdit = useCallback(async (values) => {
        try {
            if (!selectedRecord?.id) {
                throw new Error("No record selected for edit");
            }
            const response = await configController.updateColumn(resourceKey, selectedRecord.id, values);
            if (response.success) {
                setEditModalVisible(false);
                setSelectedRecord(null);
                SUCCESS("Item Updated Successfully");
                fetchData();
            } else {
                throw new Error(response.message || "Failed to update configuration");
            }
        } catch (err) {
            console.error("Failed to update configuration:", err);
            ERROR(err.message || "Failed to update configuration");
        }
    }, [resourceKey, ERROR, fetchData, selectedRecord]);

    const handleEditClick = useCallback(async (record) => {
        try {
            if (!record) {
                throw new Error("Invalid record for edit");
            }
            const response = await configController.getColumnById(resourceKey, record);
            if (response.success) {
                setSelectedRecord(response.data);
                setEditModalVisible(true);
            } else {
                throw new Error(response.message || "Failed to fetch record details");
            }
        } catch (err) {
            console.error("Failed to fetch record details:", err);
            ERROR("Failed to fetch record details");
        }
    }, [resourceKey, ERROR]);

    const handleDeleteColumn = useCallback(async (id) => {
        try {
            await configController.deleteColumn(resourceKey, id);
            fetchData();
        } catch (err) {
            console.error("Remove item failed:", err);
            ERROR("Failed to delete column"); 
        }
    }, [resourceKey, ERROR, fetchData]);

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
        if (!tableParams.sortField || !tableParams.sortOrder) {
            return data;
        }

        return [...data].sort((a, b) => {
            const field = tableParams.sortField;
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return tableParams.sortOrder === 'ascend' ? aValue - bValue : bValue - aValue;
            }

            if (aValue === null) return 1;
            if (bValue === null) return -1;

            const compareResult = String(aValue).localeCompare(String(bValue));
            return tableParams.sortOrder === 'ascend' ? compareResult : -compareResult;
        });
    }, [tableParams.sortField, tableParams.sortOrder]);

    const getCurrentPageData = useCallback(() => {
        const sortedData = getSortedData(tableData);
        const startIndex = tableParams.pageNumber * tableParams.pageSize;
        const endIndex = startIndex + tableParams.pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [tableData, tableParams.pageNumber, tableParams.pageSize, getSortedData]);
    
    return (
        <>
            {contextHolder}
            <KTable
                dataSource={getCurrentPageData()}
                initialColumns={configTableColumns}
                loading={loading || pageLoading}
                extraTitle={`Configuration - ${resourceKey}`}
                rowKey="id"
                onDeleteClick={handleDeleteColumn}
                onAddClick={() => setModalVisible(true)}
                onEditClick={handleEditClick}
                tableParams={tableParams}
                onTableChange={handleTableChange}
                isAdd={true}
                isEdit={true}
                size="small"
            />
            <ConfigModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onAdd={handleAdd}
                pathname={resourceKey}
                mode="add"
                orgId={orgId}
                SUCCESS={SUCCESS}
                ERROR={ERROR}
            />
            <ConfigModal
                SUCCESS={SUCCESS}
                ERROR={ERROR}
                orgId={orgId}
                visible={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedRecord(null);
                }}
                onAdd={handleEdit}
                pathname={resourceKey}
                mode="edit"
                initialValues={selectedRecord}
            />
        </>
    );
};

export default ConfigurationSlugPage;
