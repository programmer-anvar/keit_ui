"use client";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { getOrgId } from "@/utils/authHelper";
import { useSelector } from "react-redux";
import { SamplingController } from "@/services/samplingController";
import { CompanyTableColumns } from "@/constants/common";
import { companyService } from "@/services/companyController";
import KTable from "@/components/table/KTable";
import useKNotification from "@/hooks/useKNotification";
import CompanyAddModal from "@/components/modal/companyModal";

const FacilityPage = () => {
    const orgId = getOrgId()
    const pathname = usePathname();
    const router = useRouter()
    const { notify, contextHolder } = useKNotification();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [permissions, setPermissions] = useState({
        delete: false,
        update: false,
        "download-excel": false,
        "download-pdf": false,
        read: false,
        create: false
    });
    const adjustedResourceKey = 'client-factories';

    const paginate = useSelector((state) => state.sampling?.paginate || {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0
    });
    
    const fetchData = async (page = 0, size = 10) => {
        setLoading(true);
        try {            
            const dataResponse = await companyService.getValues();

            if (dataResponse.success) {
                setDataSource(dataResponse.data);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
            // message.error(error.message || "Failed to fetch services");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTableChange = async (pagination, filters, sorter) => {
        const newPage = pagination.current - 1; // Convert to 0-based for backend
        await fetchData(newPage, pagination.pageSize);
    };

    const handleAddItem = async (values) => {
        try {
            // const requestBody = [{ valueLines: values }];
            const response = await companyService.createValue(values);
            if (response.success) {
                // notify("success", "Item added successfully");
                setModalVisible(false);
                fetchData();
            } else {
                throw new Error(response);
            }
        } catch (error) {
            console.error("Failed to add item:", error);
            // notify("error", "Failed to add item.");
        }
    };

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

    const handleDeleteColumn = async (id) => {
		setLoading(true)
		try {
            const isDeleted = await SamplingController.deleteValues(id)
            if (isDeleted) {
                notify("success", "채취정보 삭제");
                fetchData();
                setLoading(false)
            } else {
                throw isDeleted.message
            }
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
    };

    const handleEdit = (id) => {
        router.push(`${pathname}/${id}`);
    };


    return (
        <>
            {contextHolder}
            <Card style={{ padding: "1px" }}>
                <KTable
                    rowKey="id"
                    dataSource={dataSource}
                    initialColumns={CompanyTableColumns}
                    size="small"
                    loading={loading}
                    selectedRowKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    route={adjustedResourceKey}
                    isAdd={true}
                    onAddClick={() => setModalVisible(true)}
                    tableParams={paginate}
                    onTableChange={handleTableChange}
                    onEditClick={handleEdit}
                    onDeleteClick={handleDeleteColumn}
                    isSampling={true}
                    permissions={permissions}
                />
            </Card>
            <CompanyAddModal
                visible={modalVisible}
                setModalVisible={setModalVisible}
                onAdd={handleAddItem}
                headers={CompanyTableColumns}
                onCancel={() => setModalVisible(false)}
            />
        </>
    );

};

export default FacilityPage;