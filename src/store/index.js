// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import serviceReducer from "./serviceSlice";
import layoutReducer from "./layoutSlice";

const store = configureStore({
    reducer: {
        service: serviceReducer,
        layout: layoutReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;
