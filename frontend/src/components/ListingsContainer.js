import styled from "styled-components";
import Listing from "./Listing";
import SearchHeader from "./SearchHeader";
import { useRef, useState } from "react";

const Container = styled.div`
  background-color: rgb(247, 247, 242);
  padding-top: 1em;
  padding-bottom: 6em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1em;
`

const SmallListing = styled.div`
  color: black;
  border: 1px solid black;
  width: 25em;
  padding: 1em;
  padding-top: 0;
`

const Name = styled.p`
  height: 2.5em;
  padding: 1em;
  padding-bottom: 0;
  font-size: 28px;
  cursor: pointer;
`

const Address = styled.p`
  height: 2em;
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

const NoResults = styled.div`
  height: 18em;
  margin-top: 1em;
  color: black;
  font-size: 20px;
`

const ReturnButton = styled.button`
  background-color: transparent;
  font-style: 'Epilogue', sans-serif;
  font-size: 15px;
  border: 1px solid black;
  display: block;
  margin: 0 auto;
  margin-top: 1em;
  cursor: pointer;
`

const ListingsContainer = ({ listings, setDisplayed, query, user, getProfile }) => {
  const [selected, setSelected] = useState(null);

  const containerRef = useRef();

  if (!listings) {
    return null;
  }

  const expandListing = (listing) => {
    setSelected(listing);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 10);
  };

  const apology = 
    <NoResults>
      sorry, nothing found!
      {user !== null ? 'please make a post if you have something to add!' : ''}
      <ReturnButton onClick={() => setDisplayed('filter')}>back to search</ReturnButton>
    </NoResults>

  const smallListings = listings.map(l => 
    <SmallListing key={l.id}>
      <Name onClick={() => expandListing(l)}>{l.name}</Name>

      <Address>{l.address}</Address>

      <Description>{l.description.length > 350 ? `${l.description.substring(0, 350)}...` : l.description}</Description>

      <Info>{l.comments.length === 1 ? `${l.comments.length} comment` : `${l.comments.length} comments`}</Info>
    </SmallListing>)

  return (
    <div>
      <SearchHeader selected={selected} query={selected ? [] : query} />

      <Listing listing={selected} toggleExpand={() => setSelected(null)} user={user} setDisplayed={setDisplayed} getProfile={getProfile} />

      <Container ref={containerRef} style={{ display: selected ? 'none' : '' }}>
          {listings.length === 0 ? apology : smallListings}
      </Container>

      {selected ? null : <ReturnButton onClick={() => setDisplayed('filter')}>back to search</ReturnButton>}
    </div>
  )
}

export default ListingsContainer;