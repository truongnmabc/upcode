import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import type { makeStore } from "./store";
type AppStore = ReturnType<typeof makeStore>;
type AppDispatch = AppStore["dispatch"]; // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type RootState = ReturnType<AppStore["getState"]>; // Infer the `RootState` and `AppDispatch` types from the store itself

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
