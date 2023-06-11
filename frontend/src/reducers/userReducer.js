import { createSlice } from "@reduxjs/toolkit";
import userService from '../services/users';
import loginService from '../services/login';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: {},
    selectedUser: {}
  },
  reducers: {
    loginUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      }
    },
    logoutUser(state, action) {
      return {
        ...state,
        currentUser: {}
      }
    },
    setSelectedUser(state, action) {
      return {
        ...state,
        selectedUser: action.payload
      }
    },
    addUser(state, action) {
      // state.push(action.payload);
    }
  }
});

export const { loginUser, setSelectedUser, addUser } = userSlice.actions;

export const setCurrent = (current) => {
  return async dispatch => {
    dispatch(loginUser(current));
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem('loggedAdenUser', JSON.stringify(user));

    dispatch(loginUser(user));
  }
};

export const logout = () => {

}

export const selectUser = (id) => {
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