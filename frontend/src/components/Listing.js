import styled from "styled-components";

const Container = styled.div`
  // position: absolute;
  background-color: red;
  width: 50em;
  margin: 0 auto;
  right: 0;
  left: 0;
`

const Listing = ({ listing, toggleExpand }) => {
  if (!listing) {
    return null
  };

  return (
    <Container>
      helloooo
      <button onClick={toggleExpand}>close</button>
    </Container>
  )
}

export default Listing;