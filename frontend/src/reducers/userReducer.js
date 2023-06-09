import { createSlice } from "@reduxjs/toolkit";
import userService from '../services/users';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: {},
    selectedUser: {}
  },
  reducers: {
    loginUser(state, action) { // <- for logging in
      return {
        ...state,
        currentUser: action.payload
      }
    },
    setSelectedUser(state, action) {
      return {
        ...state,
        selectedUser: action.payload
      }
    },
    addUser(state, action) {
      state.push(action.payload);
    }
  }
});

export const { loginUser, setSelectedUser, addUser } = userSlice.actions;

export const login = () => {
  // for logging in
}

export const initializeUser = (id) => {
  return async dispatch => {
    const user = await userService.read(id);
    dispatch(setSelectedUser(user));
  }
};

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
    dispatch(setSelectedUser(updatedUser));
  }
};

export default userSlice.reducer;