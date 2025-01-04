import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
    pageLoading: false,
    collapsed: false,
    processId: 1
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setPageLoading: (state, action) => {
            state.pageLoading = action.payload;
        },
        toggleCollapse: (state) => {
            state.collapsed = !state.collapsed;
        },
        setProcessId: (state, action) => {
            state.processId = action.payload;
        }
    }
});

// Memoized selector for layout state
export const selectLayoutState = createSelector(
    [(state) => state.layout],
    (layout) => ({
        pageLoading: layout?.pageLoading ?? false,
        collapsed: layout?.collapsed ?? false,
        processId: layout?.processId ?? 1
    })
);

export const { 
    setPageLoading, 
    toggleCollapse, 
    setProcessId 
} = layoutSlice.actions;

export default layoutSlice.reducer;
