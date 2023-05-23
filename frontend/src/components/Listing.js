import styled from "styled-components";

const Container = styled.div`
  // position: absolute;
  background-color: rgb(247, 247, 242);
  // border: 1px solid red;
  // width: 50em;
  // margin: 0 auto;
  // right: 0;
  // left: 0;

  color: black;
  min-height: 28em;
`

const Name = styled.p`

`

const Description = styled.p`

`

const Listing = ({ listing, toggleExpand }) => {
  if (!listing) {
    return null
  };

  return (
    <Container>
      <button onClick={() => console.log(listing)}>cl</button>

      <Name>{listing.name}</Name>

      <Description>{listing.description}</Description>

      <button onClick={toggleExpand}>close</button>
    </Container>
  )
}

export default Listing;