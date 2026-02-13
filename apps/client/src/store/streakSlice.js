import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    currentStreak: 0,
};
const streakSlice = createSlice({
    name: 'streak',
    initialState,
    reducers: {},
});
export default streakSlice.reducer;
