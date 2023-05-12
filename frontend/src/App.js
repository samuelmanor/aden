import { useState, useEffect } from 'react';

import Filter from "./components/Filter";
import MainContainer from "./components/MainContainer";
import Profile from "./components/Profile";

const App = () => {
  const [mainDisplay, setMainDisplay] = useState('filter');

  return (
    <div>
      <MainContainer>{mainDisplay === 'filter' ? <Filter /> : <Profile />}</MainContainer>
    </div>
  )
}

export default App;