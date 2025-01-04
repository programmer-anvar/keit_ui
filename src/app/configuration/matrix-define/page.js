"use client"
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import { Form, Space } from "antd";
import { useRouter } from "next/navigation";
import KTable from "@/components/table/KTable";
import { getOrgId } from "@/utils/authHelper";
import { FORM_LAYOUTS } from "@/constants/common";
import { MatrixService } from "@/services/samplingController";
import useKNotification from "@/hooks/useKNotification";
import MatrixModal from "@/components/modals/MatrixModal";

const MatrixDefinePage = () => {
    const { 
        pageLoading = false 
    } = useSelector(selectLayoutState);

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const orgId = getOrgId();
    const [paginate, setPaginate] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
    });
    const router = useRouter();
    const [form] = Form.useForm();

    const columns = useMemo(() => [
        {
            title: "Index",
            dataIndex: "index",
            key: "index",
            width: 100,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit",
            width: 150,
        },
        {
            title: "Order",
            dataIndex: "columnOrder",
            key: "columnOrder",
            width: 100,
        },
    ], []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await MatrixService.getColumns();

            if (response.success) {
                const dataWithKeys = response?.data.sort((a, b) => b.id - a.id).map((item, index) => ({
                    ...item,
                    index: index + 1,
                    key: item.id
                }));
                setDataSource(dataWithKeys);
                setPaginate(prev => ({
                    ...prev,
                    totalElements: dataWithKeys.length,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch matrix columns:", error);
            ERROR("Failed to fetch matrix columns");
        } finally {
            setLoading(false);
        }
    }, [ERROR]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await MatrixService.deleteColumn(id);
            if (response.success) {
                SUCCESS("Matrix column deleted successfully");
                fetchData();
            } else {
                throw new Error(response.message || "Failed to delete matrix column");
            }
        } catch (error) {
            console.error("Failed to delete matrix column:", error);
            ERROR(error.message || "Failed to delete matrix column");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            setLoading(true);
            const response = await MatrixService.getColumnById(id);
            if (response) {
                setEditingRecord(response);
                setModalVisible(true);
            } else {
                throw new Error("Failed to fetch matrix column details");
            }
        } catch (error) {
            console.error("Failed to fetch matrix column details:", error);
            ERROR(error.message || "Failed to fetch matrix column details");
        } finally {
            setLoading(false);
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            setLoading(true);
            let response;
            
            if (editingRecord) {
                // Update existing record
                response = await MatrixService.updateColumn(editingRecord.id, {
                    ...values,
                    id: editingRecord.id,
                });
                if (response.success) {
                    SUCCESS("Matrix column updated successfully");
                } else {
                    throw new Error(response.message || "Failed to update matrix column");
                }
            } else {
                // Create new record
                response = await MatrixService.createColumn(values);
                if (response.success) {
                    SUCCESS("Matrix column created successfully");
                } else {
                    throw new Error(response.message || "Failed to create matrix column");
                }
            }
            
            setModalVisible(false);
            setEditingRecord(null);
            fetchData();
        } catch (error) {
            console.error("Failed to save matrix column:", error);
            ERROR(error.message || "Failed to save matrix column");
        } finally {
            setLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingRecord(null);
    };

    useEffect(() => {
        fetchData();
    }, []); 

    return (
        <>
            {contextHolder}
            <KTable 
                loading={loading}
                rowKey="id"
                initialColumns={columns}
                dataSource={dataSource}
                onDeleteClick={handleDelete}
                isAdd={true}
                onEditClick={handleEdit}
                onAddClick={() => setModalVisible(true)}
            />
            <MatrixModal
                visible={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleModalSubmit}
                initialValues={editingRecord}
                loading={loading}
            />
        </>
    );
};

export default MatrixDefinePage;
