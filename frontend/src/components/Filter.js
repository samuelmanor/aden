import { useState } from 'react';
import listingService from '../services/listings';

const Filter = () => {
  const [listings, setListings] = useState([]);
  const [type, setType] = useState('first');
  const [service, setService] = useState('second');
  const [location, setLocation] = useState('third');

  const getListings = () => {
    listingService
      .getFiltered({ type: type, service: service, location: location})
      .then(returnedListings => console.log(returnedListings));
  };

  return (
    <div>
      <p>i am</p>
      <p>seeking</p>
      <p>near</p>
      <button onClick={getListings}>search</button>
      {/* <button onClick={() => console.log(listings)}>log listings</button> */}
    </div>
  )
};

export default Filter;