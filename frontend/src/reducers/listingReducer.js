import { createSlice } from '@reduxjs/toolkit';
import listingService from '../services/listings';

const listingSlice = createSlice({
  name: 'listings',
  initialState: {
    filters: {},
    query: [],
    listings: []
  },
  reducers: {
    setListings(state, action) {
      return {
        ...state,
        query: action.payload.filters,
        listings: action.payload.listings
      };
    },
    setFilters(state, action) {
      return {
        ...state,
        filters: action.payload
      };
    },
    appendListing(state,action) {
      const updatedListings = [ ...state.listings, action.payload ];
      return {
        ...state,
        listings: updatedListings
      };
    },
    removeListing(state, action) {
      const updatedListings = state.listings.filter(l => l.id !== action.payload);
      return {
        ...state,
        listings: updatedListings
      };
    }
  }
});

export const { setListings, setFilters, appendListing, removeListing } = listingSlice.actions;

export const getFilters = () => {
  return async dispatch => {
    const filters = await listingService.getFilters();
    dispatch(setFilters(filters));
  };
};

export const getListings = filters => {
  return async dispatch => {
    const listings = await listingService.search(filters);
    dispatch(setListings({ filters, listings }));
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
    dispatch(removeListing(id));
  };
};

export default listingSlice.reducer;