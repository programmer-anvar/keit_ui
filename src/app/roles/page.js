'use client'

import { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import RoleModal from "@/components/modal/RoleModal";
import { fetchRoles, fetchPermissionsList, createRole, removeRole, assignPermissionsToRole } from "@/services/managementController";
import { useRouter } from "next/navigation";
import KTable from "@/components/table/KTable";
import { getOrgId } from "@/utils/authHelper";


const RoleAndPermissionsPage = () => {
    const router = useRouter()
    const orgId = getOrgId()
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRoleData, setNewRoleData] = useState({ roleName: '', description: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const rolesData = await fetchRoles();
            setRoles(rolesData);
        } catch (err) {
            setError(err.message || "An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRole = async () => {
        try {
            
            const newRole = { ...newRoleData, organizationId: orgId };
            const response = await createRole(newRole);
            if (response.error) {
                // message.error(response.message);
            } else {
                // message.success('Role created successfully!');
                handleModalClose('role');
                fetchData();
            }
        } catch (error) {
            // message.error("Failed to create role: " + error.message);
        }
    };

    const handleRemoveRole = async (id) => {
        try {
            const response = await removeRole(`roleId=${id}`);
            if (response.error) {
                // message.error(response.message);
            } else {
                // message.success('Role removed successfully!');
                fetchData(); // Refresh the role list after removal
            }
        } catch (error) {
            // message.error("Failed to remove role: " + error.message);
        }
    };
    const handleModalOpen = (type, role = null) => {
        if (type === 'role') {
            setNewRoleData({ organizationId: '', roleName: '', description: '' });
            setIsRoleModalOpen(true);
        }
    };

    const handleModalClose = (type) => {
        if (type === 'role') {
            setIsRoleModalOpen(false);
        }
    };


    const renderRoleColumns = [
        { title: "Role Name", dataIndex: "roleName" },
        { title: "Description", dataIndex: "description" },
        {
            title: "Assigned Status",
            render: (_, role) => (
                <>
                    {
                        role.permissionsList.length > 0 ? 'assigned' : 'no assigns'
                    }
                </>
            ),
        },
    ];


    if (error) return <div>Error: {error}</div>;
    
    return (
        <Card>
            <KTable
                dataSource={roles}
                initialColumns={renderRoleColumns}
                rowKey="roleName"
                onAddClick={() => handleModalOpen('role')}
                isAdd={true}
                onDeleteClick={handleRemoveRole}
                loading={loading}
            />
            
            <RoleModal
                visible={isRoleModalOpen}
                onOk={handleCreateRole}
                onCancel={() => handleModalClose('role')}
                newRoleData={newRoleData}
                setNewRoleData={setNewRoleData}
            />
        </Card>
    );
};

export default RoleAndPermissionsPage;
