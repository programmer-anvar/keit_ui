import { fetchData } from "@/utils/requestHelper";

export const fetchServices = (processId) => fetchData(`/v1/services?processId=${processId}`);