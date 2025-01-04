import { createItem, editItem, fetchData, removeItem } from "@/utils/requestHelper";

export const SamplingController = {
    getValues: async (requestBody) => {
        return await createItem(`/lab/v1/sampling/get-values`, requestBody);
    },

    addValues: async (requestBody) => {
        return await createItem(`/lab/v1/sampling?add-values`, requestBody)
    },  

    updateValues: async (requestBody) => {
        return await editItem(`/lab/v1/sampling/update-value`, requestBody)
    },

    deleteValues: async (id, orgId) => {
        return await removeItem(`/lab/v1/sampling/delete?oneObj=${id}`);
    },  

    getValueById: async (id) => {
        return await fetchData(`/lab/v1/sampling/get-value?&objectId=${id}`);
    },
}

export const MatrixService = {
    getColumns: async () => {
        return await fetchData(`/lab/v1/sampling-matrix/get-columns`);
    },

    getColumnById: async (id) => {
        return await fetchData(`/lab/v1/sampling-matrix/column/${id}`);
    },
    
    createColumn: async (requestBody) => {
        return await createItem(`/lab/v1/sampling-matrix/columns`, requestBody)
    },

    updateColumn: async (id, requestBody) => {
        return await editItem(`lab/v1/sampling-matrix/column/${id}`, requestBody)
    },

    getColumnsValuesBySampling: async (samplingId) => {
        return await fetchData(`/lab/v1/sampling-matrix/columns-values?samplingId=${samplingId}`);
    },

    updateSamplingValues: async (samplingId, requestBody) => {
        return await editItem(`lab/v1/sampling-matrix/values?samplingId=${samplingId}`, requestBody) 
    },
}

export const SamplingMeasurementController = {
    async getSamplingMeasurements(samplingId) {
        return await fetchData(`/lab/v1/sampling-measurement/measurement-by/${samplingId}`);
    },

    async addSamplingMeasurement(requestBody, samplingId) {
        return await editItem(`lab/v1/sampling-measurement/update-value?samplingObjectId=${samplingId}`, requestBody)
    },
}

export const SamplingResultController = {
    async getSamplingResults(samplingId) {
        return await fetchData(`/lab/v1/sampling-result/result-by/${samplingId}`);
    },

    async addSamplingResult(requestBody, samplingId) {
        return await editItem(`lab/v1/sampling-result/update-value?samplingObjectId=${samplingId}`, requestBody)
    },
}