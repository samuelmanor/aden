import { configureStore } from '@reduxjs/toolkit';

import listingReducer from './reducers/listingReducer';
import commentReducer from './reducers/commentReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    listings: listingReducer,
    comments: commentReducer,
    users: userReducer
  }
});

export default store;