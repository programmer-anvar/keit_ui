"use client"

import { useEffect, useState } from "react";
import { Button, message, Spin, Card, Table, Space } from "antd";
import { createEmployee, removeEmployee, fetchAllEmployees } from "@/services/managementController";
import EmployeeModal from "@/components/modal/employeeModal";
import KTable from "@/components/table/KTable";
import { getItemSession, setItemSession } from "@/utils/persistance-storage";
import useKNotification from "@/hooks/useKNotification";

const pageData = {
    page: 0,
    size: 10
}

const EmployeesPage = () => {
    const { notify, contextHolder } = useKNotification();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newEmployeeData, setNewEmployeeData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        roleId: "",
        agencyId: ""
    });

    
    useEffect(() => {
        const savedFilters = getItemSession("employeeFilters");
    
        if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
    
        searchForm.setFieldsValue(parsedFilters.filters);
        fetchData(
            parsedFilters.pageSize,
            parsedFilters.pageNumber,
            parsedFilters.order,
            parsedFilters.field
        );
        } else {
            fetchData();
        }
    }, []);


    const fetchData = async (
        pageSize = 0,
        current = 0,
        order = 0,
        field = 0
    ) => {
        try {
            setLoading(true);
            const employeesData = await fetchAllEmployees(pageData);
            
            if (employeesData.success) {
                setEmployees(employeesData.data.documentLines);
            } else {
                setError("Failed to load employee data");
            }
        } catch (err) {
            setError(err.message || "Error while fetching employees");
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async () => {
        try {
            const response = await createEmployee(newEmployeeData);
            if (response) {
                notify("success","Employee added successfully");
                fetchData();
                setModalVisible(false);
            } else {
                notify("error","Failed to add employee");
            }
        } catch (err) {
            notify("error", "Error: " + (err.message || "Unknown error"));
        }
    };

    const columns = [
        { title: "Full Name", dataIndex: "lastName", key: "lastName", width: "300px" },
        { title: "Username", dataIndex: "username", key: "username", width: "300px" },
        { title: "roleName", dataIndex: "roleName", key: "roleName", width: "300px" },
    ];

    const handleTableChange = (pagination, filtersTable, sorter) => {
        const { current, pageSize } = pagination;
        const { order, field } = sorter || {};
    
        // Get saved filters from sessionStorage
        const savedFilters = getItemSession("employeeFilters");
        let newFilters = savedFilters ? JSON.parse(savedFilters) : {};
    
        // Update page number and size
        newFilters.pageNumber = current;
        newFilters.pageSize = pageSize;
    
        // Update sorting if available
        if (order) {
            newFilters.order = order;
            newFilters.field = field;
        }
        
        // Update session storage with new pagination details
        setItemSession("employeeFilters", JSON.stringify(newFilters));
    
        setTableParams((prev) => ({
        ...prev,
            pageSize,
            current,
            order,
            field,
        }));
    
        fetchData(pageSize, current, order, field);
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            await removeEmployee(employeeId);
            notify("success","Employee removed successfully");
            fetchData();
        } catch (err) {
            notify("error","Failed to remove employee: " + (err.message || "Unknown error"));
        }
    };

    const handleEditEmployee = async (employeeId) => {
        try {
            console.log(employeeId);
            
        } catch (error) {
            
        }
    }
    console.log('columns',columns);
    console.log('data', employees);
        
    return (
        <Space direction="vertical" size={10} style={{ 
            minWidth: 300, 
            width: "100%", 
            background: "#E9ECF4",
            padding: "0"
        }}>
            {contextHolder}
            <Card style={{padding: "1px"}}>
                <KTable
                    initialColumns={columns}
                    dataSource={employees}
                    rowKey="id"
                    pagination={{ pageSize: pageData.size }}
                    onAddClick={() => setModalVisible(true)}
                    onDeleteClick={handleDeleteEmployee}
                    size="small"
                    isAdd={true}
                    onTableChange={handleTableChange}
                    loading={loading}
                    // onEditClick={handleEditEmployee}
                />
            </Card>

            <EmployeeModal
                visible={modalVisible}
                onOk={handleAddEmployee}
                onCancel={() => setModalVisible(false)}
                employeeData={newEmployeeData}
                setEmployeeData={setNewEmployeeData}
            />
        </Space>
    );
};

export default EmployeesPage;
