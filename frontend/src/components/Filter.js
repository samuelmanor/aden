import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilters, getListings } from '../reducers/listingReducer';
import listingService from '../services/listings';
import Dropdown from './Dropdown';
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

const Filter = ({ setDisplayed }) => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.listings.filters);

  const [identity, setIdentity] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [activeQuery, setActiveQuery] = useState(false);

  const filterRef = useRef();

  useEffect(() => {
    dispatch(getFilters());
  }, [dispatch]);

  const search = async () => {
    dispatch(getListings({ identity, service, location }));

    setDisplayed('listings');
  };

  useEffect(() => {
    identity && service && location ? setActiveQuery(true) : setActiveQuery(false);
  }, [identity, service, location]);

  return (
    <div>
      <div id='filter' ref={filterRef}>

        <Dropdown placeholder='...' label={'i am'} arr={['transmasc', 'transfem']} select={setIdentity} filter={filterRef} />

        <Dropdown placeholder='...' label={'seeking'} arr={filters.services} select={setService} filter={filterRef} />

        <Dropdown placeholder='...' label={'near'} arr={filters.locations} select={setLocation} filter={filterRef} />

        { activeQuery ? <Button onClick={search}>search</Button> : null }
      </div>
    </div>
  )
};

export default Filter;