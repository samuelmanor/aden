import { useEffect, useState } from 'react';
import listingService from '../services/listings';
import Dropdown from './Dropdown';
import ListingsContainer from './ListingsContainer';

const Filter = () => {
  const [listings, setListings] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});

  const [identitySel, setIdentitySel] = useState('');
  const [serviceSel, setServiceSel] = useState('');
  const [locationSel, setLocationSel] = useState('');

  const [activeQuery, setActiveQuery] = useState(false);

  useEffect(() => {
    listingService
      .getFilters()
      .then(returnedFilters => {
        setFilterOptions({
          // identities: returnedFilters.identities,
          identities: ["transmasc", "transfem"],
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
      .then(returnedListings => setListings(returnedListings));
  };

  useEffect(() => {
    console.log('identity:', identitySel, 'service:', serviceSel, 'location:', locationSel, activeQuery); // dev
  }, [ identitySel, serviceSel, locationSel, activeQuery ]);

  useEffect(() => {
    identitySel && serviceSel && locationSel ? setActiveQuery(true) : setActiveQuery(false);
  }, [identitySel, serviceSel, locationSel]);

  return (
    <div>
      <div id='filter'>

      <Dropdown placeholder='...' title={'i am'} arr={filterOptions.identities} select={setIdentitySel} />

      <Dropdown placeholder='...' title={'seeking'} arr={filterOptions.services} select={setServiceSel} />

      <Dropdown placeholder='...' title={'near'} arr={filterOptions.locations} select={setLocationSel} />

      { activeQuery ? <button onClick={getListings}>search</button> : null }
      </div>

      <ListingsContainer listings={listings} />
    </div>
  )
};

export default Filter;