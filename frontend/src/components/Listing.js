import styled from 'styled-components';
import CommentsContainer from './CommentsContainer';
import { useDispatch, useSelector } from 'react-redux';
import { deleteListing } from '../reducers/listingReducer';
import { useState } from 'react';

const Container = styled.div`
  background-color: rgb(247, 247, 242);
  border: 1px solid black;
  border-top: 0;
  color: black;
  min-height: 27.5em;
`;

const ButtonContainer = styled.div`
  margin: 0.5em 0.5em 0 0;
  float: right;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 25px;
  cursor: pointer;
  margin: 0.2em;
  padding: 0.3em;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const User = styled.p`
  font-size: 20px;
  color: black;
  text-align: center;
  user-select: none;
`;

const Address = styled.p`
  font-size: 25px;
  padding: 1em 0 0 1em;
`;

const Description = styled.p`
  width: 80%;
  margin: 0 auto;
  font-size: 20px;
  padding: 1em;
  height: 12em;
  overflow: scroll;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Info = styled.p`
  font-size: 25px;
`;

const Listing = ({ listing, toggleExpand, getProfile }) => {
  const [showNotif, setShowNotif] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.users.currentUser);

  if (!listing) {
    return null;
  }

  const removeListing = async () => {
    dispatch(deleteListing(user.token, listing.id));

    setShowNotif(true);
  };

  const closeBtn = <Button onClick={toggleExpand}>close</Button>;

  const notif = <div>
    listing deleted!
    {closeBtn}
  </div>;

  const listingStatic = <div>
    <Container>
      <ButtonContainer>
        {listing.user.username === user._doc.username ? <Button onClick={removeListing}>delete</Button> : null}

        {closeBtn}
      </ButtonContainer>

      <Address>{listing.address}</Address>

      <Description>{listing.description}</Description>

      <InfoContainer>
        <Info>{listing.phone}</Info>

        <Info><a href={`https://${listing.website}`}>{listing.website}</a></Info>
      </InfoContainer>

    </Container>

    <User onClick={() => getProfile(listing.user.id)}>posted by {listing.user.name} - @{listing.user.username}</User>

    <CommentsContainer arr={listing.comments} listingId={listing.id} />
  </div>;

  return (
    <div>
      {showNotif ? notif : listingStatic}
    </div>
  );
};

export default Listing;