import { StoreProvider } from "./ui/StoreProvider";
import { AppDispatch, createReduxStore } from "./config/store.ts";
import { ReduxStoreWithManager, StateSchema, ThunkConfig } from "./config/StateSchema.ts";

export {
  StoreProvider,
  createReduxStore
};

export type {
  StateSchema,
  ReduxStoreWithManager,
  AppDispatch,
  ThunkConfig
};
