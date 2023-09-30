import { createSlice } from '@reduxjs/toolkit';

export const questionsReducer = createSlice({
  name: 'QUESTIONS',
  initialState: {
    questions: [],
    currQuestions: 0,
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrQuestions: (state, action) => {
      state.currQuestions = action.payload;
    },
  },
});

export const { setCurrQuestions, setQuestions } = questionsReducer.actions;

export default questionsReducer.reducer;
