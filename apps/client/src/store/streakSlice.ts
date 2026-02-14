import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  playedDates: string[]; // Array of dates played (for heatmap)
  isLoading: boolean;
}

const initialState: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  playedDates: [],
  isLoading: false,
};

// Update streak after completing puzzle
export const updateStreak = createAsyncThunk(
  'streak/update',
  async (completionDate: string, { getState }) => {
    const state = getState() as { streak: StreakState };
    const { lastPlayedDate, currentStreak, longestStreak, playedDates } = state.streak;

    const today = dayjs(completionDate);
    const lastPlayed = lastPlayedDate ? dayjs(lastPlayedDate) : null;

    // Add to played dates if not already there
    const newPlayedDates = playedDates.includes(completionDate)
      ? playedDates
      : [...playedDates, completionDate];

    // Calculate new streak
    let newStreak = currentStreak;

    if (!lastPlayed) {
      // First puzzle ever
      newStreak = 1;
    } else {
      const daysSinceLastPlayed = today.diff(lastPlayed, 'day');

      if (daysSinceLastPlayed === 0) {
        // Same day - no streak change
        newStreak = currentStreak;
      } else if (daysSinceLastPlayed === 1) {
        // Consecutive day - increment streak
        newStreak = currentStreak + 1;
      } else {
        // Missed days - reset streak
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(longestStreak, newStreak);

    return {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastPlayedDate: completionDate,
      playedDates: newPlayedDates,
    };
  }
);

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    resetStreak: (state) => {
      state.currentStreak = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateStreak.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateStreak.fulfilled, (state, action) => {
      state.currentStreak = action.payload.currentStreak;
      state.longestStreak = action.payload.longestStreak;
      state.lastPlayedDate = action.payload.lastPlayedDate;
      state.playedDates = action.payload.playedDates;
      state.isLoading = false;
    });
  },
});

export const { resetStreak } = streakSlice.actions;
export default streakSlice.reducer;