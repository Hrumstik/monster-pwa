import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./apis/authApi";
import { filesSlice } from "./apis/filesApi";
import { pwaSlice } from "./apis/pwaApi";
import { pwaTagsSlice } from "./slices/pwaTagsSlice";

const store = configureStore({
  reducer: {
    [pwaTagsSlice.reducerPath]: pwaTagsSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [filesSlice.reducerPath]: filesSlice.reducer,
    [pwaSlice.reducerPath]: pwaSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(filesSlice.middleware)
      .concat(pwaSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
