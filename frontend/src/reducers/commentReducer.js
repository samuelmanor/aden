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
      // const toEdit = state.find(c => c.id === id);

      // const editedComment = { ...toEdit, content: action.payload.content };

      // return state.map(c => c.id !== id ? c : editedComment);
      return state.map(c => c.id !== id ? c : action.payload);
    },
    removeComment(state, action) {
      console.log(state, action);
    }
  }
});

export const { addComment, updateComment, removeComment } = commentSlice.actions;

export const createComment = obj => {
  return async dispatch => {
    const newComment = await commentService.create(obj);
    dispatch(addComment(newComment));
  }
};

export const editComment = (id, content) => {
  return async dispatch => {
    const updatedComment = await commentService.update({ id, content });
    dispatch(updateComment(updatedComment));
  }
};

export default commentSlice.reducer;