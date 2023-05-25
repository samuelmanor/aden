import styled from "styled-components";
import listingService from '../services/listings';
import { useState, useEffect } from "react";

const Message = styled.p`
  font-size: 30px;
  text-align: center;
  padding-top: 8em;
`

const NewListing = ({ user }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [number, setNumber] = useState('');

  const [identOptions, setIdentOptions] = useState(null);
  const [servOptions, setServOptions] = useState(null);
  const [locOptions, setLocOptions] = useState(null);

  const [identity, setIdentity] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    listingService
      .getFilters()
      .then(returnedFilters => {
        setIdentOptions(mapOptions(["transmasc", "transfem", "both"], 'identity'));
        setServOptions(mapOptions(returnedFilters.services), 'service');
        setLocOptions(mapOptions(returnedFilters.locations), 'location');
      });
  }, []);

  const createListing = (e) => {
    e.preventDefault();
  };

  const mapOptions = (options, name) => {
    return options.map(o => <div>
      <input key={`${o}input`} type='radio' id={o} name={name} />
      <label key={`${o}label`} htmlFor={o}>{o}</label>
    </div>)
  }

  const form = 
    <form onSubmit={createListing}>
      <p>title/name:</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <p>address:</p>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />

      <p>description:</p>
      <input value={description} onChange={(e) => setDescription(e.target.value)} />

      <p>website:</p>
      <input value={website} onChange={(e) => setWebsite(e.target.value)} />

      <p>phone number:</p>
      <input value={number} onChange={(e) => setNumber(e.target.value)} />

      <p>target audience:</p>
      {identOptions}

      <p>service provided:</p>
      {servOptions}

      <p>nearest location:</p>
      {locOptions}

      <button type='submit'>post</button>
    </form>

  const message = <Message>you must be logged in to add a post.</Message>

  return (
    <div>
      {user !== null ? form : message}
    </div>
  )
}

export default NewListing;