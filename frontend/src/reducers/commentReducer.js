import { createSlice } from '@reduxjs/toolkit';
import commentService from '../services/comments';

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments(state, action){
      return action.payload;
    },
    addComment(state, action) {
      state.push(action.payload);
    },
    updateComment(state, action) {
      const id = action.payload.id;
      return state.map(c => c.id === id ? action.payload : c);
    },
    removeComment(state, action) {
      return state.filter(c => c.id !== action.payload);
    }
  }
});

export const { setComments, addComment, updateComment, removeComment } = commentSlice.actions;

export const initializeComments = (arr) => {
  return async dispatch => {
    dispatch(setComments(arr));
  }
};

export const createComment = (token, obj) => {
  return async dispatch => {
    commentService.setToken(token);

    const newComment = await commentService.create(obj);
    dispatch(addComment(newComment));
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
    dispatch(removeComment(id));
  }
}

export default commentSlice.reducer;