import { useState } from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment } from '../reducers/commentReducer';

const CommentStatic = styled.div`
  color: black;
  border-bottom: 1px solid black;
  width: 70%;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  text-align: right;
  margin-top: -1em;
  padding-bottom: 0.5em;
`;

const Button = styled.div`
  border: none;
  background-color: transparent;
  display: inline;
  padding: 0.5em;
  margin-right: 0.5em;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Info = styled.p`
  padding-top: 1em;
  font-size: 20px;
`;

const Content = styled.p`
  margin-left: 1em;
`;

const EditForm = styled.form`
  color: black;
  border-bottom: 1px solid black;
  width: 70%;
  margin: 0 auto;
  padding-top: 1em;
  font-size: 20px;
`;

const Input = styled.input`
  border: 1px solid black;
  background-color: transparent;
  font-family: 'Epilogue', sans-serif;
  margin-left: 1em;
  margin-bottom: 0.5em;
  padding: 0.5em;
  width: 80%;
`;

const EditButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 16px;
  padding: 0.5em;
  cursor: pointer;
  margin-left: 0.5em;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Comment = ({ comment, listingId }) => {
  const [editingState, setEditingState] = useState(false);
  const [content, setContent] = useState(comment.content);

  const user = useSelector(state => state.users.currentUser);
  const dispatch = useDispatch();

  const updateComment = async (e) => {
    e.preventDefault();

    dispatch(editComment(user.token, comment.id, content));

    setEditingState(false);
  };

  const removeComment = async () => {
    dispatch(deleteComment(user.token, comment.id, listingId));
  };

  const staticComment = <CommentStatic>
    <Info>{comment.user.name} @{comment.user.username}</Info>

    <Content>{content}</Content>

    <ButtonContainer>
      {comment.user.username === user._doc.username ? <Button onClick={() => setEditingState(true)}>edit</Button> : null}

      {comment.user.username === user._doc.username ? <Button onClick={removeComment}>delete</Button> : null}
    </ButtonContainer>
  </CommentStatic>;

  const editForm = <EditForm onSubmit={updateComment}>
    <p>edit comment</p>

    <Input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <EditButton type='submit'>submit</EditButton>
  </EditForm>;

  return (
    <div>
      {editingState === false ? staticComment : editForm}
    </div>
  );
};

export default Comment;