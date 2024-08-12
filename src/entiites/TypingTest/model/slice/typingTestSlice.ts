import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { TypingTestSchema, TypingTestResult } from "../types/typingTest.ts";

const initialState: TypingTestSchema = {
  data: undefined,
};

export const typingTestSlice = createSlice({
  name: "typingTest",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TypingTestResult>) => {
      state.data = action.payload;
    },
  },
  extraReducers: () => {}
});

export const { actions: typingTestActions } = typingTestSlice;
export const { reducer: typingTestReducer } = typingTestSlice;