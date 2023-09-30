import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'USER_INFO',
  initialState: {
    userName: '',
    userAssertions: 0,
    userScore: 0,
  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    increment: (state) => {
      state.userAssertions += 1;
    },
    decrement: (state) => {
      state.userAssertions -= 1;
    },
  },
});

export const { setUserName, increment, decrement } = userSlice.actions;

export default userSlice.reducer;
