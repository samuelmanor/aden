import { configureStore } from "@reduxjs/toolkit";

import commentReducer from "./reducers/commentReducer";

const store = configureStore({
  reducer: {
    comments: commentReducer
  }
});

export default store;