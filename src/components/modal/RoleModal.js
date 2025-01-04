import React from "react";
import { Modal, Form, Input } from "antd";

const RoleModal = ({ visible, onOk, onCancel, newRoleData, setNewRoleData }) => (
    <Modal
        title="Create Role"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={400}
    >
        <Form layout="vertical">
            <Form.Item label="Role Name" required>
                <Input value={newRoleData.roleName} onChange={(e) => setNewRoleData({ ...newRoleData, roleName: e.target.value })} />
            </Form.Item>
            <Form.Item label="Description" required>
                <Input.TextArea value={newRoleData.description} onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })} />
            </Form.Item>
        </Form>
    </Modal>
);

export default RoleModal;
