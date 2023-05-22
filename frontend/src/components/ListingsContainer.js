import styled from "styled-components";

const Container = styled.div`
  padding-top: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1em;
`

const Listing = styled.div`
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
`

const Address = styled.p`
  font-size: 18px;
  margin: 0;
`

const Description = styled.div`
  // border: 1px solid red;
  height: 150px;
  overflow: scroll;
  padding: 1em;
  text-align: justify;
`

const ListingsContainer = ({ listings }) => {
  if (!listings) {
    return null;
  };

  return (
    <Container>
      {listings.map(l => 
        <Listing key={l.id}>
          <Name className='gradient-bg'>{l.name}</Name>
          <Address>{l.address}</Address>
          <Description>{l.description}</Description>

          {/* <div>
            {l.phone}
            {l.website}
          </div>

          <div>
            <p>posted by {l.user.name}</p>
            <p>@{l.user.username}</p>
          </div> */}
        </Listing>)}
    </Container>
  )
}

export default ListingsContainer;