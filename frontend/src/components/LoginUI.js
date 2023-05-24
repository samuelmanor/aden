import { useEffect, useState } from "react";
import styled from "styled-components";
import loginService from '../services/login';

const Container = styled.div`
  position: absolute;
  background-color: rgb(247, 247, 242);
  right: 7em;
  margin-top: 9.3em;
  width: 16em;
  border: 1px solid black;
  border-top: 0;
  padding: 1em;
  font-family: 'Epilogue', sans-serif;
`

const Input = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  margin-left: 1em;
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-family: 'Epilogue', sans-serif;
`

const LoginUI = ({ tab }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(user)
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log('logging in with', username, password);

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = (
    <form onSubmit={handleLogin}>
      username:
      <Input type='text' value={username} onChange={({ target }) => setUsername(target.value)}/>

      password:
      <Input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />

      <Button type='submit'>log in</Button>
    </form>
  )

  return (
    <Container>
      {user === null ? loginForm : null}
    </Container>
  )
}

export default LoginUI;