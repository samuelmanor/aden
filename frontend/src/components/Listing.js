import styled from "styled-components";

const Container = styled.div`
  background-color: rgb(247, 247, 242);
  border: 1px solid black;
  border-top: 0;
  color: black;
  min-height: 25em;
`

// const ButtonContainer = styled.div`
//   // background-color: red;
//   // position: absolute;
// `

// const Button = styled.button`
//   background-color: transparent;
//   border: none;
//   color: rgb(247, 247, 242);
//   font-size: 35px;
//   cursor: pointer;
//   margin: 10px;
// `

const User = styled.p`
  font-size: 20px;
  color: black;
  text-align: center;
  user-select: none;
  cursor: pointer;
`

const Address = styled.p`
  font-size: 25px;
  padding: 1em 0 0 1em;
`

const Description = styled.p`
  width: 80%;
  margin: 0 auto;
  font-size: 20px;
  padding: 1em;
  height: 10.5em;
  overflow: scroll;
`

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Info = styled.p`
  font-size: 25px;
`

const Listing = ({ listing, toggleExpand }) => {
  if (!listing) {
    return null
  };

  return (
    <div>
      <Container>
        {/* <ButtonContainer>
          <Button>☆</Button> <- favorite button

          <Button onClick={toggleExpand}>╳</Button>
        </ButtonContainer> */}

        <Address>{listing.address}</Address>

        <Description>{listing.description}</Description>

        <InfoContainer>
          <Info>{listing.phone}</Info>

          <Info><a href={`https://${listing.website}`}>{listing.website}</a></Info>
        </InfoContainer>

      </Container>

      <User>posted by {listing.user.name} - @{listing.user.username}</User>
    </div>
  )
}

export default Listing;