import { configureStore } from "@reduxjs/toolkit";

import listingReducer from "./reducers/listingReducer";
import commentReducer from "./reducers/commentReducer";

const store = configureStore({
  reducer: {
    listings: listingReducer,
    comments: commentReducer
  }
});

export default store;