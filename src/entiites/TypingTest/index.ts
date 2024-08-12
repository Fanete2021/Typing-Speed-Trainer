import { typingTestReducer, typingTestSlice, typingTestActions } from "./model/slice/typingTestSlice.ts";
import { TypingTestSchema, TypingTestResult } from "./model/types/typingTest.ts";
import { getTypingTestData } from "./model/selectors/getMessagesData.ts";
import Stats from "./ui/Stats/Stats.tsx";

export {
  typingTestActions,
  typingTestReducer,
  typingTestSlice,
  getTypingTestData,
  Stats
};

export type {
  TypingTestSchema,
  TypingTestResult
};