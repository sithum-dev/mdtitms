import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/reducers/userSlice";
import officeReducer from "../redux/reducers/officeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    office: officeReducer,
  },
});
