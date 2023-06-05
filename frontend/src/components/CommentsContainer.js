import { useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';
import Comment from "./Comment";

import { useDispatch } from 'react-redux';
import { createComment } from "../reducers/commentReducer";

const Container = styled.div`
  // background-color: red;
  padding-bottom: 1em;
  width: 90%;
  margin: 0 auto;
  color: black;

  #comment-notif {
    text-align: center;
    padding-top: 1em;
  }
`

const Title = styled.p`
  font-size: 35px;
  text-align: center;
  // color: black;
  // border-bottom: 1px solid black;
`

const Form = styled.form`
  color: black;
  font-size: 20px;
  width: 70%;
  margin: 0 auto;

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

const CommentsContainer = ({ arr, listingId, user }) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState(arr);

  // const dispatch = useDispatch();

  const postComment = (e) => {
    e.preventDefault();

    commentService.setToken(user.token);

    // dispatch(createComment({ listingId, content }));

    const commentObj = {
      listingId,
      content
    };

    commentService.create(commentObj)
      .then(returnedComment => {
        // console.log(returnedComment);
        setContent('');

        const newCommentsArr = [...comments, returnedComment];
        setComments(newCommentsArr);
      });
  };

  const updateCommentsArr = (deletedId) => {
    const newState = comments.filter(c => c.id !== deletedId);
    setComments(newState);
  }

  const commentArr = comments.map(c => <Comment key={c.id} comment={c} user={user} listingId={listingId} updateCommentsArr={updateCommentsArr} />);
  
  const postForm = <Form onSubmit={(e) => postComment(e)}>
    <p>add a comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <button type='submit'>post</button>
  </Form>

  return (
    <Container>
      <Title>{comments.length} Comment{comments.length === 1 ? '' : 's'}</Title>

      {commentArr}

      {user !== null ? postForm : <p id='comment-notif'>you must be logged in to add a comment.</p>}
    </Container>
  )
}

export default CommentsContainer;