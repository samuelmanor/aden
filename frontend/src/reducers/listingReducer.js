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


// listingService
// .search({
//   identity: identitySel,
//   service: serviceSel,
//   location: locationSel
// })
// .then(returnedListings => {
//   setListings(returnedListings);
//   setDisplayed('listings');
//   setQuery([ identitySel, serviceSel, locationSel ]);
// });
export const getListings = filters => { // filters = { identity, service, location }
  return async dispatch => {
    const listings = await listingService.search(filters);
    dispatch(setListings(listings));
  };
};

export const createListing = obj => {
  return async dispatch => {
    const newListing = await listingService.create(obj);
    dispatch(appendListing(newListing));
  };
};

export default listingSlice.reducer;