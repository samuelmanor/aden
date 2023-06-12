import { createSlice } from '@reduxjs/toolkit';
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
      };
    },
    logoutUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    setSelectedUser(state, action) {
      return {
        ...state,
        selectedUser: action.payload
      };
    }
  }
});

export const { loginUser, logoutUser, setSelectedUser } = userSlice.actions;

export const getCurrent = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedAdenUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(loginUser(user));
    }
  };
};

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem('loggedAdenUser', JSON.stringify(user));

    dispatch(loginUser(user));
  };
};

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedAdenUser');
    dispatch(logoutUser({}));
  };
};

export const selectUser = (id) => {
  return async dispatch => {
    const user = await userService.read(id);
    dispatch(setSelectedUser(user));
  };
};

export const editUser = (token, id, obj) => {
  return async dispatch => {
    userService.setToken(token);

    const updatedUser = await userService.update(id, obj);
    dispatch(setSelectedUser(updatedUser));
  };
};

export default userSlice.reducer;