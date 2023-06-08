import { createSlice } from '@reduxjs/toolkit';
import commentService from '../services/comments';

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    addComment(state, action) {
      state.push(action.payload);
    },
    updateComment(state, action) {
      const id = action.payload.id;
      return state.map(c => c.id !== id ? c : action.payload);
    }
  }
});

export const { addComment, updateComment } = commentSlice.actions;

export const createComment = (token, obj) => {
  return async dispatch => {
    commentService.setToken(token);

    const newComment = await commentService.create(obj);
    dispatch(addComment(newComment));

    return newComment;
  }
};

export const editComment = (token, id, content) => {
  return async dispatch => {
    commentService.setToken(token);

    const updatedComment = await commentService.update(id, { content });
    dispatch(updateComment(updatedComment));
  }
};

export const deleteComment = (token, id, listingId) => {
  return async dispatch => {
    commentService.setToken(token);

    await commentService.remove(id, listingId);
    // dispatch(removeComment(id));
  }
}

export default commentSlice.reducer;