import { useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';

const Comment = ({ comment, user }) => {
  const [editingState, setEditingState] = useState(false);
  const [content, setContent] = useState(comment.content);

  const editComment = (e) => {
    e.preventDefault();
    commentService.setToken(user.token);

    commentService.update(comment.id, {content})
      .then(returnedComment => {
        setEditingState(false);
      });
  };

  const staticComment = <div>
    {comment.user.username === user._doc.username ? <button onClick={() => setEditingState(true)}>edit</button> : null}

    <p>{comment.user.name} @{comment.user.username}</p>

    <p>{content}</p>
    <button onClick={() => console.log(user.token)}>cl</button>
  </div>

  const editForm = <form onSubmit={(e) => editComment(e)}>
    <p>edit comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <button type='submit'>submit</button>
  </form>

  return (
    <div style={{ color: 'black' }}>
      {editingState === false ? staticComment : editForm}
    </div>
  )
}

export default Comment;