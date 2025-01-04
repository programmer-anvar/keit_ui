import { fetchData } from "@/utils/requestHelper";

export const fetchModuleDetails = async(moduleCode=100000) => {
    return await fetchData(`/v1/module/detailed?moduleCode=${moduleCode}`);
}