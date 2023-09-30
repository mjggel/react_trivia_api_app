import { createSlice } from '@reduxjs/toolkit';
import user_template from '../../imgs/user_template_img.png';

export const userSlice = createSlice({
  name: 'USER_INFO',
  initialState: {
    userPicture: user_template,
    userName: '',
    userEmail: '',
    userAssertions: 0,
    userScore: 0,
  },
  reducers: {
    setUserPicture: (state, action) => {
      state.userPicture = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    increment: (state) => {
      state.userAssertions += 1;
    },
    decrement: (state) => {
      state.userAssertions -= 1;
    },
  },
});

export const {
  setUserPicture,
  setUserName,
  setUserEmail,
  increment,
  decrement,
} = userSlice.actions;

export default userSlice.reducer;
