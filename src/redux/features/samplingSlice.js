import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataSource: [],
  tableHeaders: [],
  createTableHeaders: [],
  paginate: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0
  },
  loading: false
};

const samplingSlice = createSlice({
  name: 'sampling',
  initialState,
  reducers: {
    setDataSource: (state, action) => {
      state.dataSource = action.payload;
    },
    setTableHeaders: (state, action) => {
      state.tableHeaders = action.payload;
    },
    setCreateTableHeaders: (state, action) => {
      state.createTableHeaders = action.payload;
    },
    setPaginate: (state, action) => {
      state.paginate = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const {
  setDataSource,
  setTableHeaders,
  setCreateTableHeaders,
  setPaginate,
  setLoading
} = samplingSlice.actions;

export default samplingSlice.reducer;
