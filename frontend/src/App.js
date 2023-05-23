import { useState } from 'react';

import Filter from "./components/Filter";
import MainContainer from "./components/MainContainer";
import ListingsContainer from './components/ListingsContainer';
import Profile from "./components/Profile";

import './App.css'

const App = () => {
  const [displayed, setDisplayed] = useState('filter');
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState([]);

  const toggleMain = () => {
    if (displayed === 'filter') {
      return <Filter setListings={setListings} setDisplayed={setDisplayed} setQuery={setQuery} />
    } else if (displayed === 'profile') {
      return <Profile />
    } else if (displayed === 'listings') {
      return <ListingsContainer listings={listings} setDisplayed={setDisplayed} query={query} />
    }
  };

  return (
    <div>
      <div>
        <p>about</p>
        <h1 onClick={() => setDisplayed('filter')}>aden</h1>
        <p>profile</p>
      </div>

      <MainContainer>
        {toggleMain()}
      </MainContainer>
    </div>
  )
}

export default App;