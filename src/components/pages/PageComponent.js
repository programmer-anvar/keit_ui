"use client";
import { useEffect, useState } from "react";
import { Card, message } from "antd";
import { fetchAllDefinedTableHeaders } from "@/services/configController";
import AddItemModal from "@/components/modal/pageAddModal";
import KTable from "@/components/table/KTable";
import useKNotification from "@/hooks/useKNotification";
import { usePathname, useRouter } from "next/navigation";
import PagesService from "@/services/pageController";
import { getOrgId } from "@/utils/authHelper";
import { useDispatch, useSelector } from "react-redux";
import { 
    setDataSource, 
    setTableHeaders, 
    setCreateTableHeaders, 
    setPaginate, 
    setLoading 
} from "@/redux/features/samplingSlice";
import { SamplingController } from "@/services/samplingController";

const PageComponent = ({
    pathname, 
    orgId
}) => {
    const orgId = getOrgId()
    const pathname = usePathname();
    const router = useRouter()
    const { notify, contextHolder } = useKNotification();
    const dispatch = useDispatch();

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

    // Get state from Redux
    const serviceData = useSelector((state) => state.service?.serviceData || []);
    const dataSource = useSelector((state) => state.sampling?.dataSource || []);
    const tableHeaders = useSelector((state) => state.sampling?.tableHeaders || []);
    const createTableHeaders = useSelector((state) => state.sampling?.createTableHeaders || []);
    const paginate = useSelector((state) => state.sampling?.paginate || {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0
    });
    const loading = useSelector((state) => state.sampling?.loading || false);

    const adjustedResourceKey = pathname.replace(/^\//, "");
    
    const fetchData = async (page = 0, size = 10) => {
        dispatch(setLoading(true));
        try {
            // Fetching column headers
            const headersResponse = await fetchAllDefinedTableHeaders(adjustedResourceKey, 1, pathname);
            const filteredHeaders = headersResponse.filter(header => header.isCreateRequired);
            const columns = headersResponse.map(header => ({
                title: header.name,
                dataIndex: `dataIndex-${header.id}`,
                key: `col-${header.defineId}`,
                type: header.columnType,
                order: header.order,
                isRequired: header.isRequired,
                isCreateRequired: header.isCreateRequired,
                ...header
            }));
            
            dispatch(setTableHeaders(columns));
            dispatch(setCreateTableHeaders(filteredHeaders));

            const getValues = {
                "orgId": orgId,
                "page": {
                    "page": page,
                    "size": size
                }
            }
            
            const dataResponse = await PagesService.getValues(adjustedResourceKey, getValues);
            if (dataResponse.success) {
                const formattedDataSource = dataResponse.data.responseList.map((item, index) => ({

                    ...item.documentLines.reduce((acc, line) => ({
                        ...acc,
                        id: line.oneObject,
                        [`dataIndex-${line.index}`]: line.value
                    }), {})
                }));
                
                dispatch(setDataSource(formattedDataSource));
                dispatch(setPaginate({
                    pageNumber: page,
                    pageSize: size,
                    totalElements: dataResponse.data.page.totalElements + 1 || 0
                }));
            } else {
                throw new Error(dataResponse.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
            // message.error(error.message || "Failed to fetch services");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleTableChange = async (pagination, filters, sorter) => {
        const newPage = pagination.current - 1; // Convert to 0-based for backend
        await fetchData(newPage, pagination.pageSize);
    };

    const handleAddItem = async (values) => {
        try {
            const requestBody = [{ valueLines: values }];
            const response = await PagesService.createValues('sampling',requestBody, orgId);
            if (response.success) {
                notify("success", "Item added successfully");
                setModalVisible(false);
                fetchData();
            } else {
                throw new Error(response);
            }
        } catch (error) {
            console.error("Failed to add item:", error);
            notify("error", "Failed to add item.");
        }
    };

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

    const handleDeleteColumn = async (id) => {
		dispatch(setLoading(true));
		try {
            const isDeleted = await SamplingController.deleteValues(id)
            if (isDeleted) {
                notify("success", "채취정보 삭제");
                fetchData();
                dispatch(setLoading(false));
            } else {
                throw isDeleted.message
            }
		} catch (error) {
			console.log(error);
			dispatch(setLoading(false));
		}
    };

    const handleEdit = (id) => {
        router.push(`${pathname}/${id}`);
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
        const updatedPermissions = filterPermissionsForSampling(serviceData);
        setPermissions(updatedPermissions);
        if (!updatedPermissions.read) {
            router.push('/notfound');
        } else {
            fetchData();
        }
    }, [serviceData]);

    return (
        <>
            {contextHolder}
            <Card style={{ padding: "1px" }}>
                <KTable
                    rowKey="id"
                    dataSource={dataSource}
                    initialColumns={tableHeaders}
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
            <AddItemModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                headers={createTableHeaders}
                setModalVisible={setModalVisible}
                onAdd={handleAddItem}
                notify={notify}
                orgId={orgId}
            />
        </>
    );

};

export default PageComponent;