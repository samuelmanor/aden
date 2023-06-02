import { useEffect, useState } from 'react';

import Filter from "./components/Filter";
import MainContainer from "./components/MainContainer";
import ListingsContainer from './components/ListingsContainer';
import Profile from "./components/Profile";
import Header from './components/Header';

import listingService from './services/listings';
import './App.css'
import NewListing from './components/NewListing';

const App = () => {
  const [displayed, setDisplayed] = useState('filter');
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAdenUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      listingService.setToken(user.token);
    }
  }, [setUser]);

  useEffect(() => {
    console.log(`
      things to do:
        - add redux
        - add profile page/functionality
        - user crud
        - react component tests
        - returned listing styling
        - add cypress
        - add react router?
    `)
  }, []);

  const toggleMain = () => {
    if (displayed === 'filter') {
      return <Filter setListings={setListings} setDisplayed={setDisplayed} setQuery={setQuery} />
    } else if (displayed === 'profile') {
      return <Profile />
    } else if (displayed === 'listings') {
      return <ListingsContainer listings={listings} setDisplayed={setDisplayed} query={query} user={user} />
    } else if (displayed === 'new') {
      return <NewListing user={user} />
    }
  };

  return (
    <div>
      <Header setDisplayed={setDisplayed} user={user} setUser={setUser}  />

      <MainContainer>
        {toggleMain()}
      </MainContainer>
    </div>
  )
}

export default App;