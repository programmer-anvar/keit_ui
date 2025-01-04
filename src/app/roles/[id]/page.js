"use client";

import React, { useEffect, useState } from "react";
import { Table, Checkbox, Spin, Button, message, Card, Skeleton, Empty, Space, Typography } from "antd";
import { SaveOutlined, } from "@ant-design/icons";
import { usePathname, useRouter } from 'next/navigation';
import { assignPermissionsToRole, fetchPermissionsList, fetchRoles } from "@/services/managementController";
import "./page.module.css"

const PermissionAssignPage = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedCodes, setSelectedCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const id = pathname.split('/').pop();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rolesData, permissionsData] = await Promise.all([
                fetchRoles(),
                fetchPermissionsList()
            ]);
    
            // Handle no roles or permissions returned
            if (!rolesData.length || !permissionsData.length) {
                // message.warning("No roles or permissions found.");
                return;
            }
    
            const role = rolesData.find(role => role.id === Number(id));
            
            if (role) {
                setSelectedRole(role);
                setSelectedCodes(role.permissionsList);
            } else {
                // message.error("Role not found.");
            }
    
            // Sort permissionsData by code
            const sortedPermissions = permissionsData.map(category => ({
                ...category,
                subServices: category.subServices.sort((a, b) => a.code - b.code)
            })).sort((a, b) => a.code - b.code);
    
            setPermissions(sortedPermissions);
            
        } catch (err) {
            // message.error("Error while fetching data: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    const createColumns = () => {
        return [
            { 
                title: "Index", 
                width: 150,
                align: "center",
                render: (_, __, index) => index + 1 
                
            },
            {
                title: 'Service Name',
                dataIndex: 'serviceName',
                key: 'serviceName',
                align: "center",
                width: 250
            },
            {
                title: 'Read',
                dataIndex: 'read',
                key: 'read',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'read');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission} // Disable if permission does not exist
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                    );
                }
            },
            {
                title: 'Create',
                dataIndex: 'create',
                key: 'create',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'create');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission} // Disable if permission does not exist
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                    );
                }
            },
            {
                title: 'Update',
                dataIndex: 'update',
                key: 'update',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'update');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission} // Disable if permission does not exist
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                    );
                }
            },
            {
                title: 'Delete',
                dataIndex: 'delete',
                key: 'delete',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'delete');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission}
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                        
                    );
                }
            },
            {
                title: 'Download PDF',
                dataIndex: 'downloadPdf',
                key: 'downloadPdf',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'download-pdf');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission} // Disable if permission does not exist
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                    );
                }
            },
            {
                title: 'Download Excel',
                dataIndex: 'downloadExcel',
                key: 'downloadExcel',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === 'download-excel');
                    return (
                        <Checkbox
                            checked={selectedCodes.includes(permission?.code)}
                            disabled={!permission} // Disable if permission does not exist
                            onChange={() => permission && handleCheckboxChange([permission.code])}
                        />
                    );
                }
            },
            {
                title: 'Select All',
                key: 'selectAll',
                width: 150,
                align: "center",
                render: (_, record) => {
                    const innerResponses = record.innerServicesResponses || [];
                    const allPermissions = innerResponses.map(innerService => innerService.serviceName);
                    const allCodes = innerResponses.map(innerService => innerService.code);
                    
                    const isAllSelected = allCodes.every(code => selectedCodes.includes(code));
                    
                    return (
                        <Checkbox
                            checked={isAllSelected}
                            disabled={innerResponses.length === 0} // Disable if no permissions in the row
                            onChange={() => handleSelectAllRow(allCodes, isAllSelected)}
                        />
                    );
                }
            }
            ];
    };

    const handleCheckboxChange = (codesToUpdate) => {
        setSelectedCodes(prevSelected => {
            const isSelected = codesToUpdate.every(code => prevSelected.includes(code));

            return isSelected
                ? prevSelected.filter(code => !codesToUpdate.includes(code))
                : [...new Set([...prevSelected, ...codesToUpdate])];
        });
    };

    const handleSelectAllRow = (allPermissionsInRow, isAllSelected) => {
        setSelectedCodes(prevSelected => 
            isAllSelected
                ? prevSelected.filter(code => !allPermissionsInRow.includes(code))
                : [...new Set([...prevSelected, ...allPermissionsInRow])]
        );
    };

    function addParentsAndGrandparentsToArray(arr) {
        const resultSet = new Set(arr);
    
        arr.forEach(number => {
            let parent = Math.floor(number / 10) * 10;
            let grandparent = Math.floor(number / 100) * 100;
            
            resultSet.add(parent);
            resultSet.add(grandparent);
        });
    
        const filteredResults = Array.from(resultSet).filter(num => num > 0);
    
        // Return a sorted array
        return filteredResults.sort((a, b) => a - b);
    }

    const handleSave = async () => {
        try {
            const payload = {
                roleId: selectedRole.id,
                permCodes: addParentsAndGrandparentsToArray(selectedCodes),
            };

            const response = await assignPermissionsToRole(payload);
            if (response.success) {
                // message.success("Permissions assigned successfully!");
                router.push('/roles');
            } else {
                throw response;
            }
        } catch (error) {
            // message.error("Failed to assign permissions. Please try again.");
            console.error(error);
        }
    };

    // Flatten permissions data into a single dataSource for the table with group identifiers
    const dataSource = permissions.flatMap(category =>
        category.subServices.flatMap(subService => ({
            key: subService.code, // Unique key for each row
            serviceName: subService.serviceName, // Use subservice name for the Service Name column
            subServiceCode: subService.code,
            categoryCode: category.code,
            innerServicesResponses: subService.innerServicesResponses, // Store inner services responses for permissions
        }))
    ).sort((a, b) => a.subServiceCode - b.subServiceCode); // Sort the dataSource by subServiceCode

    return (
        <Card 
            title={
                <Typography>
                    {selectedRole && <span style={{ color: "#3388FF", marginInline: 8 }}>
                        {`Assign permissions to the ${selectedRole?.roleName} role!`}
                    </span>}
                </Typography>
            }
            extra={
                <Space>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />}
                        onClick={handleSave} 
                        style={{ marginTop: '20px' }}
                    >
                        Save
                    </Button>
                </Space>
            }
        >            

            <Table
                columns={createColumns()}
                dataSource={dataSource}
                pagination={false}
                rowKey="key"
                virtual
                scroll={{
                    y: 600,
                }}
                locale={{
                    emptyText: loading ? <Skeleton active={true} /> : <Empty />
                }}
                rowClassName={(record, index) => (index % 2 === 0 ? 'grouped-row' : '')}
            />
        </Card>
    );
};

export default PermissionAssignPage;
