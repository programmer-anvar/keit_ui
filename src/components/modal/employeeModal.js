import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Spin, message } from "antd";
import { fetchRoles } from "@/services/managementController"; // Fetch roles from backend
import { getOrgId } from "@/utils/authHelper";

const EmployeeModal = ({ visible, onOk, onCancel, employeeData, setEmployeeData }) => {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    useEffect(() => {
        const getRoles = async () => {
            try {
                setLoadingRoles(true);
                const response = await fetchRoles();
                if (response) {
                    setRoles(response);
                } else {
                    // message.error("Failed to load roles.");
                }
            } catch (error) {
                // message.error("Error fetching roles: " + (error.message || "Unknown error"));
            } finally {
                setLoadingRoles(false);
            }
        };

        if (visible) {
            getRoles();
        }
    }, [visible]);

    const handleOk = () => {

        const newEmployeeData = {
            ...employeeData,
        };

        onOk(newEmployeeData); // Call onOk with the updated employee data
    };
    
    return (
        <Modal
            title="Add New Employee"
            open={visible}
            onOk={handleOk} // Use handleOk instead of onOk directly
            onCancel={onCancel}
            width={400}
        >
            <Form layout="vertical">
                <Form.Item label="Full Name" required>
                    <Input
                        value={employeeData.lastname}
                        onChange={(e) => setEmployeeData({ ...employeeData, lastname: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Username" required>
                    <Input
                        value={employeeData.username}
                        onChange={(e) => setEmployeeData({ ...employeeData, username: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Password" required>
                    <Input.Password
                        value={employeeData.password}
                        onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Role" required>
                    {loadingRoles ? (
                        <Spin />
                    ) : (
                        <Select
                            placeholder="Select Role"
                            value={employeeData.roleId}
                            onChange={(value) => setEmployeeData({ ...employeeData, roleId: value })}
                        >
                            {roles.map((role) => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.roleName}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Agency ID" required>
                    <Input
                        value={employeeData.agencyId}
                        onChange={(e) => setEmployeeData({ ...employeeData, agencyId: Number(e.target.value) })}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EmployeeModal;
