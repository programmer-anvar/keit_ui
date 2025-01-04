import { configureStore } from '@reduxjs/toolkit';
import samplingReducer from './features/samplingSlice';
import serviceReducer from './features/serviceSlice';

export const store = configureStore({
  reducer: {
    sampling: samplingReducer,
    service: serviceReducer,
  },
});

export default store;
