import styled from 'styled-components';

const Container = styled.div`
  width: 60em;
  height: 35em;
  margin: 0 auto;
  font-family: 'Epilogue', sans-serif;
  color: #f7f7f2  
`

const MainContainer = (props) => {
  return (
    <Container className='gradient-bg'>
      {props.children}
    </Container>
  )
};

export default MainContainer;