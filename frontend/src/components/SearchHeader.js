import styled from "styled-components";

const Title = styled.p`
  color: black;
  background-color: rgb(247, 247, 242);
  font-size: 30px;
`

const Query = styled.p`
  font-size: 40px;
  padding-left: 1em;
`

const SearchHeader = ({ selected, query }) => {
  const results = 
    <div>
      <Title>results for</Title>

      <Query>
          <strong>{query[0]} {query[1]}</strong> near <strong>{query[2]}</strong>
      </Query>
    </div>

  const listingName = 
    <div>
      {selected ? selected.name : null}
    </div>
    
  return (
    <div>
      {query.length === 0 ? listingName : results}
    </div>
  )
}

export default SearchHeader;