import styled from "styled-components";

const QueryTitle = styled.p`
  color: black;
  background-color: rgb(247, 247, 242);
  font-size: 30px;
`

const Query = styled.div`
  font-size: 40px;
  padding-left: 1em;
  height: 1.5em;
`

const Name = styled.p`
  font-size: 40px;
  margin: 0;
  padding: 1em;
  padding-bottom: 0.5em;
`

const Bold = styled.p`
  font-weight: 600;
  display: inline;
`

const SearchHeader = ({ selected, query }) => {
  const results = 
    <div>
      <QueryTitle>results for</QueryTitle>

      <Query>
          <Bold>{query[0]} {query[1]}</Bold> near <Bold>{query[2]}</Bold>
      </Query>
    </div>

  const listingName = 
    <Name>
      {selected ? selected.name : null}
    </Name>
    
  return (
    <div>
      {query.length === 0 ? listingName : results}
    </div>
  )
}

export default SearchHeader;