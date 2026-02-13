export type PuzzleType = 'matrix' | 'pattern' | 'sequence' | 'deduction' | 'binary';

export interface BasePuzzle {
  id: string;
  type: PuzzleType;
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
  title: string;
  description: string;
  maxHints: number;
  timeLimit?: number; // in seconds, optional
}

export interface MatrixPuzzle extends BasePuzzle {
  type: 'matrix';
  grid: number[][];
  solution: number[][];
  rules: string[];
}

export interface PatternPuzzle extends BasePuzzle {
  type: 'pattern';
  sequence: string[];
  options: string[];
  correctAnswer: string;
}

export interface SequencePuzzle extends BasePuzzle {
  type: 'sequence';
  numbers: (number | null)[];
  solution: number[];
  rule: string;
}

export interface DeductionPuzzle extends BasePuzzle {
  type: 'deduction';
  clues: string[];
  grid: {
    rows: string[];
    cols: string[];
  };
  solution: Record<string, string>;
}

export interface BinaryPuzzle extends BasePuzzle {
  type: 'binary';
  gates: {
    inputs: boolean[];
    gate: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR';
    expected: boolean;
  }[];
  solution: boolean[];
}

export type Puzzle = MatrixPuzzle | PatternPuzzle | SequencePuzzle | DeductionPuzzle | BinaryPuzzle;

export interface GameState {
  puzzle: Puzzle;
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
  currentAnswer: any;
  isComplete: boolean;
  score: number;
}