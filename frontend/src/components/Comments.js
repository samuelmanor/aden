import styled from "styled-components";

const Container = styled.div`
  // background-color: red;
  padding-bottom: 1em;
  width: 90%;
  margin: 0 auto;
`

const Title = styled.p`
  font-size: 35px;
  text-align: center;
  color: black;
  border-bottom: 1px solid black;
`

// const Comment = styled.div`

// `

const Comments = ({ comments }) => {

  
  return (
    <Container>
      <Title>{comments.length} Comment{comments.length === 1 ? '' : 's'}</Title>
    </Container>
  )
}

export default Comments;