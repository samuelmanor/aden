import { useState } from "react";
import styled from "styled-components";
import commentService from '../services/comments';

const Comment = ({ comment, user, listingId, updateCommentsArr }) => {
  const [editingState, setEditingState] = useState(false);
  const [content, setContent] = useState(comment.content);

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

  const staticComment = <div>
    {comment.user.username === user._doc.username ? <button onClick={() => setEditingState(true)}>edit</button> : null}

    {comment.user.username === user._doc.username ? <button onClick={deleteComment}>delete</button> : null}

    <p>{comment.user.name} @{comment.user.username}</p>

    <p>{content}</p>
  </div>

  const editForm = <form onSubmit={(e) => editComment(e)}>
    <p>edit comment</p>

    <input type='text' value={content} onChange={({ target }) => setContent(target.value)} />

    <button type='submit'>submit</button>
  </form>

  return (
    <div>
      {editingState === false ? staticComment : editForm}
    </div>
  )
}

export default Comment;