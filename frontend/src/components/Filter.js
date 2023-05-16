import { useEffect, useState } from 'react';
import listingService from '../services/listings';
import Dropdown from './Dropdown';

const Filter = () => {
  // const [listings, setListings] = useState([]); // other component will house listings obj ?
  const [filterOptions, setFilterOptions] = useState({});

  const [identitySel, setIdentitySel] = useState('');
  const [serviceSel, setServiceSel] = useState('');
  const [locationSel, setLocationSel] = useState('');

  useEffect(() => {
    listingService
      .getFilters()
      .then(returnedFilters => {
        setFilterOptions({
          identities: returnedFilters.identities,
          services: returnedFilters.services,
          locations: returnedFilters.locations
        });
      });
  }, []);

  const getListings = () => {
    listingService
      .search({
        identity: identitySel,
        service: serviceSel,
        location: locationSel
      })
      .then(returnedListings => console.log(returnedListings));
  };

  useEffect(() => {
    console.log('identity:', identitySel, 'service:', serviceSel, 'location:', locationSel);
  }, [ identitySel, serviceSel, locationSel ]);

  return (
    <div>
      <p>i am</p>
      <Dropdown placeholder='...' arr={filterOptions.identities} select={setIdentitySel} />

      <p>seeking</p>
      <Dropdown placeholder='...' arr={filterOptions.services} select={setServiceSel} />

      <p>near</p>
      <Dropdown placeholder='...' arr={filterOptions.locations} select={setLocationSel} />

      <button onClick={getListings}>search</button>
    </div>
  )
};

export default Filter;