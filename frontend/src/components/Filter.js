import { useState } from 'react';
import listingService from '../services/listings';

const Filter = () => {
  const [listings, setListings] = useState([]);
  const [identity, setIdentity] = useState('first');
  const [service, setService] = useState('second');
  const [location, setLocation] = useState('third');

  const getListings = () => {
    const filters = { identity: identity, service: service, location: location };

    listingService
      .getFiltered(filters)
      .then(returnedListings => setListings(returnedListings));
  };

  return (
    <div>
      <p>i am</p>
      <p>seeking</p>
      <p>near</p>
      <button onClick={getListings}>search</button>
    </div>
  )
};

export default Filter;