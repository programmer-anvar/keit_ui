"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectLayoutState } from "@/store/layoutSlice";
import { Card, Result } from "antd";
import configController from "@/services/configController";
import AddItemModal from "@/components/modal/pageAddModal";
import KTable from "@/components/table/KTable";
import useKNotification from "@/hooks/useKNotification";
import { usePathname } from "next/navigation";
import PagesService from "@/services/pageController";
import { getOrgId } from "@/utils/authHelper";
import useErrorHandler from "@/hooks/useErrorHandler";

const CommonPage = (path) => {
    const { 
        pageLoading 
    } = useSelector(selectLayoutState);
    
    const { SUCCESS, ERROR, contextHolder } = useKNotification();
    const { error, handleError, clearError } = useErrorHandler();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [paginate, setPaginate] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 1,
        order: null,
        field: "",
    });
    const [createTableHeaders, setCreateTableHeaders] = useState([]);
    const pathname = usePathname();
    const adjustedResourceKey = pathname.replace(/^\//, "");
    const orgId = getOrgId();
    const transformData = useCallback((data) => {
        if (!data) return [];
        return data.map((item, index) => ({
            ...item,
            key: `row-${item.id || index}`,
            index: index + 1
        }));
    }, []);



    const fetchData = async () => {
        try {
            const headersResponse = await configController.fetchAllTableHeaders(adjustedResourceKey, 1, pathname);
            if (headersResponse.success) {
                const filteredHeaders = headersResponse?.data?.filter(header => header.isCreateRequired);
            
                const columns = headersResponse?.data?.map(header => ({
                    title: header.name,
                    dataIndex: `dataIndex-${header.index}`,
                    key: `col-${header.defineId || header.index}`,
                    type: header.columnType,
                    order: header.order,
                    isRequired: header.isRequired,
                    isCreateRequired: header.isCreateRequired,
                    ...header
                }));
    
                setTableHeaders(columns);
                setCreateTableHeaders(filteredHeaders);    
            } else {
                throw headersResponse.message || '데이터를 불러오는데 실패했습니다.';
            }

            const getValues = {
                "orgId": orgId,
                "page": {
                    "page": 0,
                    "size": 100
                }
            };
        
            const dataResponse = await PagesService?.getAllValues(adjustedResourceKey, getValues);
            if (dataResponse.success) {
                const formattedDataSource = transformData(dataResponse.data.responseList.map((item, idx) => {
                    const rowData = {
                        id: item.id || `row-${idx}`,
                        key: item.id || `row-${idx}`,
                    };
                    
                    item.documentLines.forEach((line) => {
                        rowData[`dataIndex-${line.index}`] = line.value;
                        if (line.index === 0) {
                            rowData.title = line.value;
                        }
                    });
                    
                    return rowData;
                }));
                setDataSource(formattedDataSource);
                setPaginate(dataResponse.data.page);
            } else {
                throw dataResponse.message || '데이터를 불러오는데 실패했습니다.';
            }
        } catch (error) {
            ERROR(error.message || '데이터를 불러오는데 실패했습니다.');
        }
    };

    const handleTableChange = async (paginationParams, filters, sorter) => {
        try {
            const getValues = {
                page: paginationParams.current - 1,
                size: paginationParams.pageSize,
                sort: sorter.field ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}` : undefined,
                ...filters
            };

            const dataResponse = await PagesService.getAllValues(adjustedResourceKey, getValues);
            if (dataResponse.success) {
                const formattedDataSource = transformData(dataResponse.data.responseList);
                setDataSource(formattedDataSource);
                setPaginate({
                    ...dataResponse.data.page,
                    pageNumber: dataResponse.data.page.pageNumber + 1
                });
            } else {
                throw dataResponse.message || '데이터를 불러오는데 실패했습니다.';
            }
        } catch (error) {
            ERROR(error.message || '데이터를 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

    const handleDeleteColumn = async (id) => {
        try {
            const isDeleted = await PagesService.deleteValues(adjustedResourceKey, id, orgId);
            if (isDeleted.success) {
                SUCCESS("success", "채취정보");
                fetchData();
            } else {
                throw isDeleted.message || '삭제에 실패했습니다.';
            }
        } catch (error) {
            ERROR(error.message || '삭제에 실패했습니다.');
        }
    };

    if (error) {
        return (
            <Result
                status={error.status}
                title={error.message}
                subTitle={error.message}
            />
        );
    }

    return (
        <>
            {contextHolder}
            <KTable
                dataSource={dataSource}
                initialColumns={tableHeaders}
                size="small"
                tableParams={paginate}
                loading={pageLoading}
                selectedRowKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                onTableChange={handleTableChange}
                route={`${adjustedResourceKey}-config`}
                isAdd={true}
                onAddClick={() => setModalVisible(true)}
                extraTitle={`${adjustedResourceKey}`}
                onDeleteClick={handleDeleteColumn}
            />
            <AddItemModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                headers={createTableHeaders}
                SUCCESS={SUCCESS}
                ERROR={ERROR}
            />
        </>
    );
};

export default CommonPage;
