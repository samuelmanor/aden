import { useState } from 'react';

import Filter from "./components/Filter";
import MainContainer from "./components/MainContainer";
import Profile from "./components/Profile";

import './App.css'

const App = () => {
  const [mainDisplay, setMainDisplay] = useState('filter');

  return (
    <div>
      <div>
        <p>about</p>
        <h1 onClick={() => setMainDisplay('filter')}>aden</h1>
        <p>profile</p>
      </div>

      <MainContainer>{mainDisplay === 'filter' ? <Filter /> : <Profile />}</MainContainer>
    </div>
  )
}

export default App;