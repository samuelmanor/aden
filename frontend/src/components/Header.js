import styled from "styled-components";
import LoginUI from "./LoginUI";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid black;
  align-items: center;
  height: 5em;
  margin: 0 auto;
  margin-bottom: 2em;
  width: 90%;
  user-select: none;
`

const Title = styled.p`
  cursor: pointer;
  font-family: 'Rubik Mono One', sans-serif;
  font-size: 70px;
  color: transparent;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: black;
`

const Tab = styled.p`
  font-family: 'Epilogue', sans-serif;
  font-size: 25px;
  cursor: pointer;
`

const Header = ({ setDisplayed, user, setUser }) => {
  const [showLoginUI, toggleShowLoginUi] = useState(false);

  return (
    <Container>
      <Tab onClick={() => setDisplayed('new')}>add a post</Tab>

      <Title onClick={() => setDisplayed('filter')}>aden</Title>
      
      <Tab onClick={() => toggleShowLoginUi(!showLoginUI)} >
        {user === null ? 'log in' : user._doc.name}
      </Tab>

      {showLoginUI ? <LoginUI user={user} setUser={setUser} /> : null}
    </Container>
  )
}

export default Header;