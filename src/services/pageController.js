import { createItem, fetchData, removeItem } from "@/utils/requestHelper";

const PagesService = {
    getAllValues: async (path, requestParam) => {
        return await createItem(`/lab/v1/${path}/get-values`, requestParam);
    },

    createValues: async (path, requestBody) => {
        return await createItem(`lab/v1/${path}/add-value`, requestBody)
    },

    deleteValues: async (path, oneObj) => {
        return await removeItem(`lab/v1/${path}/delete-value?oneObj=${oneObj}`)
    },
    createUserToken: async (data) => {
            const response = await createItem("lab/v1/user-devices", data);
            return response;
    },
}

export default PagesService;
