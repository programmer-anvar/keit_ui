import { createItem, editItem, fetchData, removeItem} from "@/utils/requestHelper";

export const enumService = {
    get: async () => {
        return await fetchData(`lab/v1/enums/get-all`);
    },

    getById: async (id) => {
        return await fetchData(`/lab/v1/enums/get/${id}`);
    },

    post: async (data, orgId) => {
        return await createItem(`/lab/v1/enums/save?organizationId=${orgId}`, data);
    },

    update: async (data) => {
        return await editItem(`/lab/v1/enums/update`, data);
    },

    delete: async (id) => {
        return await removeItem(`/lab/v1/enums/delete-type/${id}`);
    },

    deleteList: async (id) => {
        return await removeItem(`/lab/v1/enums/delete-list/${id}`);
    },

    deleteValue: async (id) => {
        return await removeItem(`/lab/v1/enums/delete-value/${id}`);
    }
};