"use client";

import React, { useEffect, useState } from "react";
import { Table, Checkbox, Card, Spin, Button } from "antd";
import { usePathname } from 'next/navigation';
import { assignPermissionsToRole, fetchPermissionsList, fetchRoles } from "@/services/managementController";

const PermissionAssignPage = () => {
    const pathname = usePathname();
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const id = pathname.split('/').pop();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rolesData, permissionsData] = await Promise.all([
                fetchRoles(),
                fetchPermissionsList()
            ]);

            const role = rolesData.find(role => role.id === Number(id));
            
            if (role) {
                setSelectedRole(role);
                setSelectedPermissions(role.permissionsList);
            } else {
                console.warn("Role not found");
            }

            if (permissionsData) {
                setPermissions(permissionsData);
            } else {
                console.warn("Permissions not found");
            }
            
        } catch (err) {
            console.error(err.message || "An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create columns dynamically based on permission types (like create, read, etc.)
    const createColumns = (category) => {
        // Get a list of all unique permission types from subservices (like "create", "read", etc.)
        const allPermissions = category.subServices.flatMap(subService => 
            subService.innerServicesResponses.map(innerService => ({
                code: innerService.code,
                name: innerService.serviceName // E.g. "create", "read"
            }))
        );

        const uniquePermissions = Array.from(new Set(allPermissions.map(p => p.name))); // Unique permission names

        return [
            {
                title: 'Actions', // First column will list the subservice names
                dataIndex: 'serviceName',
                key: 'serviceName',
            },
            ...uniquePermissions.map(permissionType => ({
                title: permissionType, // Permission type as the column header
                dataIndex: permissionType, // Unique permission type
                key: permissionType,
                render: (_, record) => {
                    const permission = record.innerServicesResponses.find(innerService => innerService.serviceName === permissionType);
                    const permissionCode = permission ? permission.code : null; // Get the permission code for this subservice and permission type
                    
                    return (
                        <Checkbox
                            checked={selectedPermissions.includes(permissionCode)} // Check if the permission code is selected
                            onChange={() => handleCheckboxChange(permissionCode)} // Toggle the permission
                            disabled={!permissionCode} // Disable if no permission code exists
                        />
                    );
                }
            }))
        ];
    };

    const handleCheckboxChange = (permissionCode) => {
        setSelectedPermissions(prevSelected => {
            const isAlreadySelected = prevSelected.includes(permissionCode);
            if (isAlreadySelected) {
                // Remove the selected code
                return prevSelected.filter(code => code !== permissionCode);
            } else {
                // Add the new code
                return [...prevSelected, permissionCode];
            }
        });
    };

    const handleSave = () => {
        const uniqueCodes = Array.from(new Set(selectedPermissions)); // Remove duplicates
        const payload = {
            roleId: selectedRole.id,
            permCodes: uniqueCodes
        }
        const response = assignPermissionsToRole(payload)
    };

    if (loading) return <Spin />;

    return (
        <div style={{ padding: '20px' }}>
            {permissions.map((category, categoryIndex) => (
                <Card title={category.serviceName} key={categoryIndex} style={{ marginBottom: '20px' }}>
                    <Table
                        columns={createColumns(category)} // Dynamically create permission columns for each category
                        dataSource={category.subServices.map((subService, subServiceIndex) => ({
                            key: `${categoryIndex}-${subServiceIndex}`,
                            serviceName: subService.serviceName, // Sub-service name (e.g., THC, Mobile)
                            innerServicesResponses: subService.innerServicesResponses, // Permissions for this sub-service
                        }))}
                        pagination={false}
                        rowKey="key"
                    />
                </Card>
            ))}
            <Button 
                type="primary" 
                onClick={handleSave} 
                style={{ marginTop: '20px' }}
            >
                Save
            </Button>
        </div>
    );
};

export default PermissionAssignPage;
