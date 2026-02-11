import { createSlice } from '@reduxjs/toolkit';

interface PuzzleState {
  currentPuzzle: any;
}

const initialState: PuzzleState = {
  currentPuzzle: null,
};

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {},
});

export default puzzleSlice.reducer;