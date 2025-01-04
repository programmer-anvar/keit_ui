import { createItem, editItem, fetchData, removeItem } from "@/utils/requestHelper";

// Fetch roles
export const fetchRoles = () => fetchData(`/v1/role`);

// Fetch permissions list
export const fetchPermissionsList = () => fetchData(`/v1/role/get/permissions-list`);

// Create a new role
export const createRole = async (roleData) => {
    return await createItem(`/v1/role/create`, roleData);
};

// Delete role
export const removeRole = async (id) => {
    return await removeItem(`/v1/role/id?${id}`);
};

// Assign Permission to Role a new role
export const assignPermissionsToRole = async (assignedData) => {
    return await createItem(`/v1/role/assign-permission`, assignedData);
};

// Fetch user
export const fetchAllEmployees = async (pageData) => {
    return await createItem(`/v1/user/all`, pageData);
};

// Fetch user
export const createEmployee = async (userData) => {
    return await createItem(`/v1/user/add-employee`, userData);
};

// Delete role
export const removeEmployee = async (id) => {
    return await removeItem(`/v1/role/id?${id}`);
};

export const updateEmployee = async() => {
    return await editItem()
}