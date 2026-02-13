import { createSlice } from '@reduxjs/toolkit';

interface StreakState {
  currentStreak: number;
}

const initialState: StreakState = {
  currentStreak: 0,
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {},
});

export default streakSlice.reducer;