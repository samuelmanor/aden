import { useEffect, useRef, useState } from 'react';
import listingService from '../services/listings';
import Dropdown from './Dropdown';
import ListingsContainer from './ListingsContainer';
import styled from "styled-components";

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: rgb(247, 247, 242);
  font-size: 40px;
  font-family: 'Epilogue', sans-serif;
  margin: 0 auto;
  display: block;
  cursor: pointer;
  &:hover {
    background-color: rgba(247, 247, 242, 0.2);
  }
`

const Filter = () => {
  const [listings, setListings] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});

  const [identitySel, setIdentitySel] = useState('');
  const [serviceSel, setServiceSel] = useState('');
  const [locationSel, setLocationSel] = useState('');

  const [activeQuery, setActiveQuery] = useState(false);

  const filterRef = useRef();

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

  // useEffect(() => {
  //   console.log('identity:', identitySel, 'service:', serviceSel, 'location:', locationSel, activeQuery); // dev
  // }, [ identitySel, serviceSel, locationSel, activeQuery ]);

  useEffect(() => {
    identitySel && serviceSel && locationSel ? setActiveQuery(true) : setActiveQuery(false);
  }, [identitySel, serviceSel, locationSel]);

  return (
    <div>
      <div id='filter' ref={filterRef}>

        <Dropdown placeholder='...' label={'i am'} arr={filterOptions.identities} select={setIdentitySel} filter={filterRef} />

        <Dropdown placeholder='...' label={'seeking'} arr={filterOptions.services} select={setServiceSel} filter={filterRef} />

        <Dropdown placeholder='...' label={'near'} arr={filterOptions.locations} select={setLocationSel} filter={filterRef} />

        { activeQuery ? <Button onClick={getListings}>search</Button> : null }
      </div>

      <ListingsContainer listings={listings} />
    </div>
  )
};

export default Filter;