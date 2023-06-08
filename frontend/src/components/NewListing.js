import styled from "styled-components";
import listingService from '../services/listings';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createListing } from "../reducers/listingReducer";

const Message = styled.p`
  font-size: 30px;
  text-align: center;
  padding-top: 8em;
`

const Option = styled.div`
  border: 1px solid ${props => props.$selected};
  cursor: pointer;
`

const NewListing = ({ user, setDisplayed }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [identity, setIdentity] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const [options, setOptions] = useState(null);
  const [notif, setNotif] = useState('you must be logged in to add a post.');
  const [showMessage, toggleShowMessage] = useState(user === null ? true : false);

  const dispatch = useDispatch();

  useEffect(() => {
    listingService
      .getFilters()
      .then(returnedFilters => {
        setOptions({
          identities: mapOptions(['transmasc', 'transfem', 'both'], identity, setIdentity),
          services: mapOptions(returnedFilters.services, service, setService),
          locations: mapOptions(returnedFilters.locations, location, setLocation)
        })
      });
  });

  const postListing = async (e) => {
    e.preventDefault();

    const newObj = {
      name,
      address,
      description,
      website,
      phone,
      identity,
      location,
      service
    };

    dispatch(createListing(user.token, newObj));

    setNotif(`created ${name}!`);

    toggleShowMessage(true);
    setTimeout(() => {
      toggleShowMessage(false);
      setDisplayed('filter');
    }, 10000);
  };

  const mapOptions = (options, type, set) => {
    return options.map(o => <div>
      <Option
        onClick={() => set(o)} 
        $selected={type === o ? 'white' : 'transparent'}>
        {o}
      </Option>
    </div>)
  };

  const form = 
    <form onSubmit={postListing}>
      <p>title/name:</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <p>address:</p>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />

      <p>description:</p>
      <input value={description} onChange={(e) => setDescription(e.target.value)} />

      <p>website:</p>
      <input value={website} onChange={(e) => setWebsite(e.target.value)} />

      <p>phone number:</p>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      <p>target audience:</p>
      {options ? options.identities : null}

      <p>service provided:</p>
      {options ? options.services : null}

      <p>nearest location:</p>
      {options ? options.locations : null}

      <button type='submit'>post</button>
    </form>

  const message = <Message>{notif}</Message>

  return (
    <div>
      {showMessage ? message : form}
    </div>
  )
}

export default NewListing;