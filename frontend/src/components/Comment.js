import { useEffect, useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';

const CommentStatic = styled.div`
  color: black;
  border-bottom: 1px solid black;
  width: 70%;
  margin: 0 auto;
`

const ButtonContainer = styled.div`
  text-align: right;
  margin-top: -1em;
  padding-bottom: 0.5em;
`

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
`

const Info = styled.p`
  padding-top: 1em;
  font-size: 20px;
`

const Content = styled.p`
  margin-left: 1em;
`

const EditForm = styled.form`
  color: black;
  border-bottom: 1px solid black;
  width: 70%;
  margin: 0 auto;
  padding-top: 1em;
  font-size: 20px;

  input {
    border: 1px solid black;
    background-color: transparent;
    font-family: 'Epilogue', sans-serif;
    margin-left: 1em;
    margin-bottom: 0.5em;
    padding: 0.5em;
    width: 80%;
  }

  button {
    border: none;
    background-color: transparent;
    font-size: 16px;
    padding: 0.5em;
    cursor: pointer;
    margin-left: 0.5em;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`

const Comment = ({ comment, user, listingId, updateCommentsArr }) => {
  const [editingState, setEditingState] = useState(false);
  const [content, setContent] = useState(comment.content);

  const currentUser = user === null ? { _doc: '' } : user;

  const editComment = (e) => {
    e.preventDefault();
    commentService.setToken(user.token);

    commentService.update(comment.id, {content})
      .then(() => {
        setEditingState(false);
      });
  };

  const deleteComment = () => {
    commentService.setToken(user.token);

    commentService.remove(comment.id, listingId)
      .then(() => {
        updateCommentsArr(comment.id);
      });
  };

  const staticComment = <CommentStatic>
    <Info>{comment.user.name} @{comment.user.username}</Info>

    <Content>{content}</Content>

    <ButtonContainer>
      {comment.user.username === currentUser._doc.username ? <Button onClick={() => setEditingState(true)}>edit</Button> : null}

      {comment.user.username === currentUser._doc.username ? <Button onClick={deleteComment}>delete</Button> : null}
    </ButtonContainer>
  </CommentStatic>

  const editForm = <EditForm onSubmit={(e) => editComment(e)}>
    <p>edit comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <button type='submit'>submit</button>
  </EditForm>

  return (
    <div>
      {editingState === false ? staticComment : editForm}
    </div>
  )
}

export default Comment;