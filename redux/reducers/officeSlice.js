import { createSlice } from "@reduxjs/toolkit";

export const officeSlice = createSlice({
  name: "office",
  initialState: {
    office: null,
  },
  reducers: {
    setOffice: (state, action) => {
      state.office = action.payload;
    },
  },
});

export const { setOffice } = officeSlice.actions;

export const selectOffice = (state) => state.office.office;

export default officeSlice.reducer;
