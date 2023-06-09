import { useState } from "react";
import styled from "styled-components";
import loginService from '../services/login';
import listingService from '../services/listings';

const Container = styled.div`
  position: absolute;
  background-color: rgb(247, 247, 242);
  right: 4.5em;
  margin-top: 13em;
  width: 12em;
  border: 1px solid black;
  border-top: 0;
  padding: 1em;
  font-family: 'Epilogue', sans-serif;
  font-size: 20px;
  height: 7em;
  text-align: center;
  z-index: 1;
`

const Input = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  display: block;
  margin: 0.5em auto 0.5em auto;
  font-size: 18px;
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-family: 'Epilogue', sans-serif;
  font-size: 20px;
  display: block;
  margin: 0 auto;
  cursor: pointer;
`

const LoginUI = ({ user, setUser, setDisplayed, getProfile }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedAdenUser', JSON.stringify(user));

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception)
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedAdenUser');
    setDisplayed('filter');
    setUser(null);
  };

  const loginForm = (
    <form onSubmit={handleLogin}>
      username:
      <Input type='text' value={username} onChange={({ target }) => setUsername(target.value)}/>

      password:
      <Input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />

      <Button type='submit'>log in</Button>
    </form>
  );

  const profileForm = (
    <div>
      <p onClick={() => getProfile(user._doc._id)}>profile</p>
      <p onClick={handleLogout}>log out</p>
    </div>
  );

  return (
    <Container>
      {user === null ? loginForm : profileForm}
    </Container>
  )
}

export default LoginUI;