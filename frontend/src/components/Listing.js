import styled from "styled-components";

const Container = styled.div`
  background-color: rgb(247, 247, 242);
  color: black;
  min-height: 28em;
`

const Description = styled.p`

`

const Listing = ({ listing, toggleExpand }) => {
  if (!listing) {
    return null
  };

  return (
    <Container>
      {/* <button onClick={() => console.log(listing)}>cl</button> */}

      <Description>{listing.description}</Description>

      <button onClick={toggleExpand}>close</button>
    </Container>
  )
}

export default Listing;