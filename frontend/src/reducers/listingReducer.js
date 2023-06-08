import { createSlice } from "@reduxjs/toolkit";
import listingService from '../services/listings';

const listingSlice = createSlice({
  name: 'listings',
  initialState: [],
  reducers: {
    setListings(state, action) {
      return action.payload
    },
    appendListing(state,action) {
      state.push(action.payload);
    }
  }
});

export const { setListings, appendListing } = listingSlice.actions;

export const getListings = filters => {
  return async dispatch => {
    const listings = await listingService.search(filters);
    dispatch(setListings(listings));
  };
};

export const createListing = (token, obj) => {
  return async dispatch => {
    listingService.setToken(token);

    const newListing = await listingService.create(obj);
    dispatch(appendListing(newListing));
  };
};

export const deleteListing = (token, id) => {
  return async dispatch => {
    listingService.setToken(token);

    await listingService.remove(id);
  }
}

export default listingSlice.reducer;