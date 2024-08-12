import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { TypingTestSchema, ITypingTest } from "../types/typingTest.ts";

const initialState: TypingTestSchema = {
  data: undefined,
};

export const typingTestSlice = createSlice({
  name: "typingTest",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<ITypingTest>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {

  }
});

export const { actions: typingTestActions } = typingTestSlice;
export const { reducer: typingTestReducer } = typingTestSlice;