import { createItem, fetchData, removeItem, editItem } from "@/utils/requestHelper";

const fetchService = {
    getResult: async (requestParam) => {
        return await createItem(`/lab/v1/fetch-mapping/get-result`, requestParam);
    },

    getAll: async () => {
        return await fetchData(`/lab/v1/fetch-mapping/get-all`);
    },

    getByCode: async (code) => {
        return await fetchData(`/lab/v1/fetch-mapping/values/${code}`);
    },

    getById: async (id) => {
        return await fetchData(`/lab/v1/fetch-mapping/get-by-id/${id}`);
    },

    getForFetch: async () => {
        return await fetchData(`/lab/v1/fetch-mapping/values`);
    },

    post: async (requestBody) => {
        return await createItem(`lab/v1/fetch-mapping/create-fetch`, requestBody)
    },

    delete: async (id) => {
        return await removeItem(`lab/v1/fetch-mapping/delete-fetch/${id}`)
    },

    update: async (id, requestBody) => {
        return await editItem(`lab/v1/fetch-mapping/update-fetch/${id}`, requestBody)
    },
}

export default fetchService;