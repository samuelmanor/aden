import { useEffect, useState } from 'react';

import Filter from "./components/Filter";
import MainContainer from "./components/MainContainer";
import ListingsContainer from './components/ListingsContainer';
import Header from './components/Header';
import NewListing from './components/NewListing';

import listingService from './services/listings';
import './App.css'
import ProfileAny from './components/ProfileAny';

const App = () => {
  const [displayed, setDisplayed] = useState('filter');
  const [user, setUser] = useState(null);
  const [profileId, setProfileId] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAdenUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, [setUser]);

  useEffect(() => {
    console.log(`
      things to do:
        - add redux
          - user create/delete
          - fix state initialization?? -> now, set comments state from listings once listing is selected
        - get rid of obsolete import statements
        - react component tests
        - styling
          - new listing
          - returned listings
          - profile
        - add cypress
        - add react router?
    `)
  }, []);

  const getProfile = (id) => {
    setProfileId(id);
    setDisplayed('profile');
  };

  const toggleMain = () => {
    if (displayed === 'filter') {
      return <Filter setDisplayed={setDisplayed} />
    } else if (displayed === 'profile') {
      return <ProfileAny user={user} id={profileId} />
    } else if (displayed === 'listings') {
      return <ListingsContainer setDisplayed={setDisplayed} user={user} getProfile={getProfile} />
    } else if (displayed === 'new') {
      return <NewListing user={user} setDisplayed={setDisplayed} />
    }
  };

  return (
    <div>
      <Header setDisplayed={setDisplayed} user={user} setUser={setUser} getProfile={getProfile}  />

      <MainContainer>
        {toggleMain()}
      </MainContainer>
    </div>
  )
}

export default App;