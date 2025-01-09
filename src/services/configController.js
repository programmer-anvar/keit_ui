import { createItem, editItem, fetchData, removeItem } from "@/utils/requestHelper";

const configController = {
    // fetchAllTableHeaders: async (resourceKey) => {
    //     const response = await fetchData(`/lab/v1/${resourceKey}/table-headers`);
    //     return response;
    // },

    getColumnById: async (resourceKey, id) => {
        const response = await fetchData(`/lab/v1/${resourceKey}/get-define-id/${id}`);
        return response;
    },

    addDefineColumn: async (resourceKey, data) => {
        const response = await createItem(`/lab/v1/${resourceKey}/define-column`, data);
        return response;
    },

    deleteColumn: async (resourceKey, id) => {
        const response = await removeItem(`/lab/v1/${resourceKey}/delete-colum?id=${id}`);
        return response;
    },

    updateColumn: async (resourceKey, id, data) => {
        const response = await editItem(`/lab/v1/${resourceKey}/update/${id}`, data);
        return response;
    },


    getAllDefines: async (resourceKey, requestBody) => {
        const response = await createItem(`/lab/v1/${resourceKey}/get-all-defines`, requestBody);
        return response;
    },

    fetchAllDefines: async (resourceKey) => {
        const response = await fetchData(`/lab/v1/${resourceKey}/get-all-defines`);
        return response;
    },
};

export default configController;