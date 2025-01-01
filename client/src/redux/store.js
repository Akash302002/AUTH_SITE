import { configureStore } from "@reduxjs/toolkit";
import appReducer from './slices/app'

const store = configureStore({
  reducer: {
    auth:appReducer  // Add the reducer for your slice(s) here
  },
});

export default store;
