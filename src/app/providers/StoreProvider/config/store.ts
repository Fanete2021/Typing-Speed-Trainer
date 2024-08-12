import { configureStore, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import { StateSchema } from "./StateSchema";
import { createReducerManager } from "./reducerManager";
import { typingTestReducer } from "@/entiites/TypingTest";

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
)
{
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    typingTest: typingTestReducer
  };

  const reducerManager = createReducerManager(rootReducers);

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<StateSchema>,
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
  });

  // @ts-ignore
  store.reducerManager = reducerManager;

  return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];