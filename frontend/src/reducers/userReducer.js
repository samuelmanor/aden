import { createSlice } from "@reduxjs/toolkit";
import userService from '../services/users';

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    addUser(state, action) {
      state.push(action.payload);
    },
    updateUser(state, action) {
      const id = action.payload.id;
      return state.map(u => u.id !== id ? u : action.payload);
    }
  }
});

export const { addUser, updateUser } = userSlice.actions;

export const createUser = obj => {
  return async dispatch => {
    const newUser = await userService.create(obj);
    dispatch(addUser(newUser));
  }
};

export const editUser = (token, id, obj) => {
  return async dispatch => {
    userService.setToken(token);

    const updatedUser = await userService.update(id, obj);
    dispatch(updateUser(updatedUser));
  }
};

export default userSlice.reducer;