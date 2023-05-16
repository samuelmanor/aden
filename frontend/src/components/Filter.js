import { useEffect, useState } from 'react';
import listingService from '../services/listings';

const Filter = () => {
  // const [listings, setListings] = useState([]); // other component will house listings obj ?
  const [query, setQuery] = useState({ identity: null, service: null, location: null });

  const [identities, setIdentities] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    listingService
      .getFilters()
      .then(returnedFilters => {
        setIdentities(returnedFilters.identities);
        setServices(returnedFilters.services);
        setLocations(returnedFilters.locations);
      });
  }, []);

  const getListings = () => {
    // const filters = { identity: identity, service: service, location: location };

    listingService
      .search(query)
      .then(returnedListings => console.log(returnedListings));
  };

  return (
    <div>
      <p>i am</p>
      <p>seeking</p>
      <p>near</p>
      {/* <button onClick={() => console.log(identities, services, locations)}>search</button> */}
    </div>
  )
};

export default Filter;