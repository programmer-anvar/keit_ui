import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serviceData: [],
  loading: false,
  error: null
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServiceData: (state, action) => {
      state.serviceData = action.payload;
    },
    setServiceLoading: (state, action) => {
      state.loading = action.payload;
    },
    setServiceError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setServiceData, setServiceLoading, setServiceError } = serviceSlice.actions;

export default serviceSlice.reducer;
