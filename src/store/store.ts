import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authApi";
import { filesSlice } from "./slices/filesApi";
import { pwaSlice } from "./slices/pwaApi";

const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(filesSlice.middleware)
      .concat(pwaSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
