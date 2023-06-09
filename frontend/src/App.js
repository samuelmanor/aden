import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrent } from './reducers/userReducer';

import Filter from './components/Filter';
import MainContainer from './components/MainContainer';
import ListingsContainer from './components/ListingsContainer';
import Header from './components/Header';
import NewListing from './components/NewListing';
import ProfileAny from './components/ProfileAny';

import './App.css';

const App = () => {
  const [displayed, setDisplayed] = useState('filter');
  const [profileId, setProfileId] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrent());
  }, []);

  const getProfile = (id) => {
    setProfileId(id);
    setDisplayed('profile');
  };

  const toggleMain = () => {
    if (displayed === 'filter') {
      return <Filter setDisplayed={setDisplayed} />;
    } else if (displayed === 'profile') {
      return <ProfileAny id={profileId} />;
    } else if (displayed === 'listings') {
      return <ListingsContainer setDisplayed={setDisplayed} getProfile={getProfile} />;
    } else if (displayed === 'new') {
      return <NewListing setDisplayed={setDisplayed} />;
    }
  };

  return (
    <div>
      <Header setDisplayed={setDisplayed} getProfile={getProfile} />

      <MainContainer>
        {toggleMain()}
      </MainContainer>
    </div>
  );
};

export default App;