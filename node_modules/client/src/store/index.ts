import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import puzzleReducer from './puzzleSlice';
import streakReducer from './streakSlice';

// Load persisted streak from localStorage
const loadPersistedStreak = () => {
  try {
    const persistedStreak = localStorage.getItem('streakState');
    return persistedStreak ? JSON.parse(persistedStreak) : undefined;
  } catch {
    return undefined;
  }
};

const preloadedState = {
  streak: loadPersistedStreak() || {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    playedDates: [],
    isLoading: false,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    puzzle: puzzleReducer,
    streak: streakReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginGoogle/fulfilled'],
      },
    }),
});

// Persist streak to localStorage on any streak action
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('streakState', JSON.stringify(state.streak));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;