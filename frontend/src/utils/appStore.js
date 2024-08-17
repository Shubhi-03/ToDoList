
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";


const appStore = configureStore({
  reducer: {
    user: userReducer,
    // list: listReducer
  },
});

export default appStore;