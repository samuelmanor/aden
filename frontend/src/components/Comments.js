import { useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';

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

const Comments = ({ arr, listingId, token }) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState(arr);

  const postComment = (e) => {
    e.preventDefault();

    commentService.setToken(token);

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

  const commentMap = comments.map(c => 
    <div key={c.id} style={{ color: 'black' }}>
      <p>{c.user.name} @{c.user.username}</p>
      <p>{c.content}</p>
      {/* <button onClick={() => console.log(c)}>cl comment</button> */}
    </div>);
  
  const commentForm = <form onSubmit={(e) => postComment(e)}>
    <p style={{ color: 'black' }}>add a comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />
    <button type='submit'>post</button>
  </form>

  return (
    <Container>
      <Title>{arr.length} Comment{arr.length === 1 ? '' : 's'}</Title>

      {/* <button onClick={() => console.log(arr)}>cl all comments</button> */}

      {commentMap}

      {commentForm}
    </Container>
  )
}

export default Comments;