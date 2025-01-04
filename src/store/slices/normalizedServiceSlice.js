import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const serviceAdapter = createEntityAdapter({
    selectId: (service) => service.id,
    sortComparer: (a, b) => a.code.localeCompare(b.code)
});

const initialState = serviceAdapter.getInitialState({
    status: 'idle',
    error: null,
    cache: {
        timestamp: null,
        ttl: 5 * 60 * 1000 // 5 minutes
    }
});

const normalizedServiceSlice = createSlice({
    name: 'normalizedService',
    initialState,
    reducers: {
        servicesFetching: (state) => {
            state.status = 'loading';
        },
        servicesFetched: (state, action) => {
            state.status = 'succeeded';
            state.cache.timestamp = Date.now();
            serviceAdapter.setAll(state, action.payload);
        },
        servicesFailed: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        serviceAdded: serviceAdapter.addOne,
        serviceUpdated: serviceAdapter.updateOne,
        serviceRemoved: serviceAdapter.removeOne,
    }
});

export const {
    servicesFetching,
    servicesFetched,
    servicesFailed,
    serviceAdded,
    serviceUpdated,
    serviceRemoved
} = normalizedServiceSlice.actions;

export const {
    selectAll: selectAllServices,
    selectById: selectServiceById,
    selectIds: selectServiceIds
} = serviceAdapter.getSelectors((state) => state.normalizedService);

export default normalizedServiceSlice.reducer;
