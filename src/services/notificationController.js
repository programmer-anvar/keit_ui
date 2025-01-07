import { fetchData, createItem } from "@/utils/requestHelper";
import { headers } from "../../next.config";

export const NotificationService = {
    get: async () => {
        return await fetchData(`/lab/v1/messages`);
    },
    getSelectedUser: async (requstBody) => {
        return await createItem(`/v1/user/all`,requstBody
        );
    },
    markRead: async (id) => {
        return await createItem(`/lab/v1/messages/${id}/mark-read`,
        );
    },
    searchMessage: async (query) => {
            return await fetchData(`/lab/v1/messages/search?query=${query}`);
    },
    getById: async (id) => {
        return await fetchData(`/lab/v1/messages/${id}`);
    },
    createValue: async (requestData) => {
        return await createItem(`/lab/v1/notifications/send-immediate`, requestData,{
            headers: {
                'Content-Type': 'multipart/form-data', 
              },
        });
    },
};
