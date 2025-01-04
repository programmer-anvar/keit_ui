// store/serviceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    serviceData: [],
};

const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
        setServiceData: (state, action) => {
            // Ensure we're not storing functions in the state
            if (action.payload && typeof action.payload === 'object') {
                try {
                    // Convert to JSON and back to remove non-serializable data
                    const serializedData = JSON.parse(JSON.stringify(action.payload));
                    state.serviceData = Array.isArray(serializedData) ? serializedData : [];
                } catch (error) {
                    state.serviceData = [];
                }
            } else {
                state.serviceData = [];
            }
        },
    },
});

export const { setServiceData } = serviceSlice.actions;

export default serviceSlice.reducer;
