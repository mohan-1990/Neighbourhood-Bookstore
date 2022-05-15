import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    publishers: [],
    categories: [],
    sort: 'default',
  },
  reducers: {
    selectPublisher(state, action) {
      state.publishers.push(action.payload);
    },
    deselectPublisher(state, action) {
      state.publishers = state.publishers.filter((value) => value !== action.payload);
    },
    selectCategory(state, action) {
      state.categories.push(action.payload);
    },
    deselectCategory(state, action) {
      state.categories = state.categories.filter(
        (value) => value !== action.payload
      );
    },
    chooseSort(state, action) {
      state.sort = action.payload;
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice.reducer;
