import { useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';
import Comment from "./Comment";

const Container = styled.div`
  // background-color: red;
  padding-bottom: 1em;
  width: 90%;
  margin: 0 auto;
`

const Title = styled.p`
  font-size: 35px;
  text-align: center;
  color: black;
  // border-bottom: 1px solid black;
`

// const Comment = styled.div`

// `

const CommentsContainer = ({ arr, listingId, user }) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState(arr);

  const postComment = (e) => {
    e.preventDefault();

    commentService.setToken(user.token);

    const commentObj = {
      listingId,
      content
    };

    commentService.create(commentObj)
      .then(returnedComment => {
        console.log(returnedComment);
        setContent('');

        const newCommentsArr = [...comments, returnedComment];
        setComments(newCommentsArr);
      });
  };

  const commentArr = comments.map(c => <Comment key={c.id} comment={c} user={user} />);
  
  const postForm = <form onSubmit={(e) => postComment(e)}>
    <p style={{ color: 'black' }}>add a comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <button type='submit'>post</button>
  </form>

  return (
    <Container>
      <Title>{comments.length} Comment{comments.length === 1 ? '' : 's'}</Title>

      {/* <button onClick={() => console.log(arr)}>cl all comments</button> */}

      {commentArr}

      {postForm}
    </Container>
  )
}

export default CommentsContainer;