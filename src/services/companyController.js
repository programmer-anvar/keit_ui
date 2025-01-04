import { createItem, fetchData, removeItem } from "@/utils/requestHelper";

export const companyService = {
    get: async () => {
        return await fetchData(`/lab/v1/client-factories/all`);
    },

    getById: async (id) => {
        return await fetchData(`/lab/v1/client-factories/${id}`);
    },

    getStuffValues: async (id) => {
        return await fetchData(`/lab/v1/client-stuffs/by-factory/${id}`);
    },

    createValue: async (requestBody) => {
        return await createItem(`lab/v1/client-factories/add`, requestBody)
    },
}

export const stuffsService =  {
    getValues: async (id) => {
        return await fetchData(`/lab/v1/client-stuffs/by-factory?id=${id}`);
    },
}
