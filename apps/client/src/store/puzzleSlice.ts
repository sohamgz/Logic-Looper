import { generatePuzzleSignature } from '@logic-looper/shared';
import { updateStreak } from './streakSlice';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Puzzle, GameState } from '../types/puzzle.types';
import { getTodaysPuzzle } from '@utils/puzzleGenerator';
import { validatePuzzle, calculateScore } from '@utils/puzzleValidators';
import { saveProgress, getProgress } from '@/services/storage';
import dayjs from 'dayjs';

export interface PuzzleState {
  currentPuzzle: Puzzle | null;
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  lastPlayedDate: string | null;
}

const initialState: PuzzleState = {
  currentPuzzle: null,
  gameState: null,
  isLoading: false,
  error: null,
  lastPlayedDate: null,
};

// Load today's puzzle
export const loadTodaysPuzzle = createAsyncThunk(
  'puzzle/loadTodays',
  async (_, { rejectWithValue }) => {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      
      // Check if there's saved progress
      const savedProgress = await getProgress(today);
      
      // Get today's puzzle
      const puzzle = getTodaysPuzzle(); // This should work now
      
      if (savedProgress && !savedProgress.completed) {
        // Resume saved puzzle
        return {
          puzzle,
          resumedState: savedProgress,
        };
      }
      
      // Start new puzzle
      return { puzzle, resumedState: null };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Submit answer
export const submitAnswer = createAsyncThunk(
  'puzzle/submitAnswer',
  async (userAnswer: any, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { puzzle: PuzzleState };
      const { currentPuzzle, gameState } = state.puzzle;

      if (!currentPuzzle || !gameState) {
        throw new Error('No active puzzle');
      }

      const isCorrect = validatePuzzle(currentPuzzle, userAnswer);

      if (isCorrect) {
        const timeTaken = Math.floor((Date.now() - gameState.startTime) / 1000);
        const score = calculateScore(timeTaken, gameState.hintsUsed, currentPuzzle.difficulty);

        // Save to IndexedDB
        await saveProgress(currentPuzzle.date, {
          date: currentPuzzle.date,
          puzzleId: currentPuzzle.id,
          puzzleType: currentPuzzle.type,
          currentState: userAnswer,
          score,
          timeTaken,
          hintsUsed: gameState.hintsUsed,
          completed: true,
          lastUpdated: new Date().toISOString(),
        });

        dispatch(updateStreak(currentPuzzle.date));

        return { isCorrect: true, score, timeTaken };
      }

      return { isCorrect: false, score: 0, timeTaken: 0 };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    startTimer: (state) => {
      if (state.gameState) {
        state.gameState.startTime = Date.now();
      }
    },
    updateAnswer: (state, action: PayloadAction<any>) => {
      if (state.gameState) {
        state.gameState.currentAnswer = action.payload;
      }
    },
    useHint: (state) => {
      if (state.gameState && state.gameState.hintsUsed < state.currentPuzzle!.maxHints) {
        state.gameState.hintsUsed += 1;
      }
    },
    resetPuzzle: (state) => {
      state.currentPuzzle = null;
      state.gameState = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTodaysPuzzle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadTodaysPuzzle.fulfilled, (state, action) => {
      state.currentPuzzle = action.payload.puzzle;
      state.lastPlayedDate = action.payload.puzzle.date;
      
      if (action.payload.resumedState) {
        state.gameState = {
          puzzle: action.payload.puzzle,
          startTime: Date.now(),
          elapsedTime: action.payload.resumedState.timeTaken,
          hintsUsed: action.payload.resumedState.hintsUsed,
          currentAnswer: action.payload.resumedState.currentState,
          isComplete: action.payload.resumedState.completed,
          score: action.payload.resumedState.score,
        };
      } else {
        state.gameState = {
          puzzle: action.payload.puzzle,
          startTime: Date.now(),
          elapsedTime: 0,
          hintsUsed: 0,
          currentAnswer: null,
          isComplete: false,
          score: 0,
        };
      }
      
      state.isLoading = false;
    });
    builder.addCase(loadTodaysPuzzle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(submitAnswer.fulfilled, (state, action) => {
      if (state.gameState) {
        state.gameState.isComplete = action.payload.isCorrect;
        state.gameState.score = action.payload.score;
      }
    });
  },
});

export const { startTimer, updateAnswer, useHint, resetPuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;