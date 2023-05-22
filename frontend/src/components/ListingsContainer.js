import styled from "styled-components";
import Listing from "./Listing";
import { useRef, useState } from "react";

const Container = styled.div`
  padding-top: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1em;
`

const SmallListing = styled.div`
  color: black;
  border: 1px solid black;
  width: 26em;
  padding: 1em;
  padding-top: 0;
`

const Name = styled.p`
  height: 2.5em;
  color: rgb(247, 247, 242);
  padding: 1em;
  font-size: 28px;
  cursor: pointer;
`

const Address = styled.p`
  font-size: 18px;
  margin: 0;
`

const Description = styled.div`
  height: 150px;
  padding: 1em;
  text-align: justify;
`

const Info = styled.p`
  text-align: center;
  user-select: none;
`

const ListingsContainer = ({ listings }) => {
  const [selected, setSelected] = useState(null);

  const containerRef = useRef();

  if (!listings) {
    return null;
  };

  const expandListing = (listing) => {
    setSelected(listing);
    setTimeout(() => {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  };

  return (
    <Container ref={containerRef}>
       <Listing listing={selected} toggleExpand={() => setSelected(null)} />

      {listings.map(l => 
        <SmallListing key={l.id}>
          <Name className='gradient-bg' onClick={() => expandListing(l)}>{l.name}</Name>

          <Address>{l.address}</Address>

          <Description>{l.description.length > 350 ? `${l.description.substring(0, 350)}...` : l.description}</Description>

          <Info>{l.comments.length === 1 ? `${l.comments.length} comment` : `${l.comments.length} comments`}</Info>
        </SmallListing>)}
    </Container>
  )
}

export default ListingsContainer;