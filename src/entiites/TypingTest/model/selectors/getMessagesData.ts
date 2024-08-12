import { StateSchema } from "@/app/providers/StoreProvider";

export const getTypingTestData = (state: StateSchema) => state.typingTest?.data;