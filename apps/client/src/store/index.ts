import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import puzzleReducer from './puzzleSlice';
import streakReducer from './streakSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    puzzle: puzzleReducer,
    streak: streakReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginGoogle/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;