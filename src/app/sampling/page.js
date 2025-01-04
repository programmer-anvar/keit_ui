"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import { Card, message } from "antd";
import configController, { fetchAllDefinedTableHeaders } from "@/services/configController";
import AddItemModal from "@/components/modal/pageAddModal";
import KTable from "@/components/table/KTable";
import useKNotification from "@/hooks/useKNotification";
import { usePathname, useRouter } from "next/navigation";
import PagesService from "@/services/pageController";
import { getOrgId } from "@/utils/authHelper";
import { SamplingController } from "@/services/samplingController";

const SamplingPage = () => {
    const { 
        pageLoading 
    } = useSelector(selectLayoutState);

    const orgId = getOrgId()
    const pathname = usePathname();
    const router = useRouter()
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const [tableHeaders, setTableHeaders] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [createTableHeaders, setCreateTableHeaders] = useState([]);
    const [paginate, setPaginate] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 1,
        order: null,
        field: "",
    });
    const [dataSource, setDataSource] = useState([]);
    const [error, setError] = useState(null);

    const adjustedResourceKey = pathname.replace(/^\//, "");
    const [permissions, setPermissions] = useState({
        delete: false,
        update: false,
        "download-excel": false,
        "download-pdf": false,
        read: true,
        create: false
    });

    const fetchData = async (page = 0, size = 10) => {
        try {
            // Fetch and set up columns using index
            const headersResponse = await configController.fetchAllTableHeaders(adjustedResourceKey);
            const filteredHeaders = headersResponse?.data.filter(header => header.isCreateRequired);
            const columns = headersResponse?.data.map(header => ({
                title: header.showName || header.name,
                dataIndex: header.index,  // Column index
                key: header.index.toString(),
                width: 150,
                align: 'center',
                type: header.type,
                order: header.order,
                isRequired: header.isRequired,
                isCreateRequired: header.isCreateRequired,
                ...header
            }));
            
            setTableHeaders(columns)
            setCreateTableHeaders(filteredHeaders)

            const getValues = {
                "page": {
                    "page": page,
                    "size": size
                }
            }
            
            const dataResponse = await SamplingController.getValues(getValues);
            if (dataResponse.success) {
                // Group data by oneObject (row identifier)
                const groupedByOneObject = dataResponse.data.responseList.reduce((acc, item) => {
                    item.documentLines.forEach(line => {
                        // Initialize row if it doesn't exist
                        if (!acc[line.oneObject]) {
                            acc[line.oneObject] = {
                                oneObject: line.oneObject,
                                id: line.oneObject,
                                key: line.oneObject.toString(),  // Row key
                                title: line.showName
                            };
                        }
                        // Add value using index as column identifier
                        acc[line.oneObject][line.index] = line.value;
                    });
                    return acc;
                }, {});

                // Convert to array format for table
                const formattedDataSource = Object.values(groupedByOneObject);
                
                setDataSource(formattedDataSource)
                setPaginate({
                    pageNumber: page,
                    pageSize: size,
                    totalElements: formattedDataSource.length || 0
                })
            } else {
                throw new Error(dataResponse.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
            setError(error.message);
        }
    };

    const handleTableChange = async (pagination, filters, sorter) => {
        const newPage = pagination.current - 1; 
        await fetchData(newPage, pagination.pageSize);
    };

    const handleAddItem = async (values) => {
        try {
            const response = await PagesService.createValues('sampling', values);
            if (response.success) {
                SUCCESS("success", "Item added successfully");
                fetchData();
            } else {
                throw new Error(response);
            }
        } catch (error) {
            console.error("Failed to add item:", error);
            ERROR("Failed to add item.");
        }
    };

    const handleDeleteColumn = async (id) => {
        try {
            const isDeleted = await SamplingController.deleteValues(id)
            if (isDeleted) {
                SUCCESS("success", "채취정보 삭제");
                fetchData();
            } else {
                throw isDeleted.message
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (id) => {
        window.location.assign(`sampling/${id}`);
    };

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

    const filterPermissionsForSampling = (serviceData) => {
        for (const service of serviceData) {
            for (const subService of service.subServices || []) {
                if (subService.serviceName === "Sampling") {
                    return subService.innerServicesResponses.reduce((acc, service) => {
                        acc[service.serviceName] = service.hasPermission;
                        return acc;
                    }, {});
                }
            }
        }
        return {};
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <KTable
                rowKey="id"
                dataSource={dataSource}
                initialColumns={tableHeaders}
                size="small"
                loading={pageLoading}
                selectedRowKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
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
            
            <AddItemModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                headers={createTableHeaders}
                setModalVisible={setModalVisible}
                onAdd={handleAddItem}
                orgId={orgId}
            />
        </>
    );
};

export default SamplingPage;