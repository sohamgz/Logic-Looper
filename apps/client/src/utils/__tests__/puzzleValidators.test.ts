import {
  validatePuzzle,
} from '../puzzleValidators';
import type { Puzzle } from '../../types/puzzle.types';

describe('Puzzle Validators', () => {
  describe('Matrix Puzzle Validator', () => {
    it('should validate correct 4x4 matrix', () => {
      const puzzle: Puzzle = {
        id: 'test-matrix',
        type: 'matrix',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Matrix',
        description: 'Test',
        maxHints: 3,
        grid: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        solution: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        rules: [],
      };

      const answer = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should reject incorrect matrix', () => {
      const puzzle: Puzzle = {
        id: 'test-matrix',
        type: 'matrix',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Matrix',
        description: 'Test',
        maxHints: 3,
        grid: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        solution: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        rules: [],
      };

      const answer = [[1, 2, 3, 4], [3, 4, 2, 1], [2, 1, 4, 3], [4, 3, 2, 1]]; // Wrong
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle partially filled matrix', () => {
      const puzzle: Puzzle = {
        id: 'test-matrix',
        type: 'matrix',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Matrix',
        description: 'Test',
        maxHints: 3,
        grid: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        solution: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        rules: [],
      };

      const answer = [[1, 2, null, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });
  });

  describe('Pattern Puzzle Validator', () => {
    it('should validate correct pattern answer', () => {
      const puzzle: Puzzle = {
        id: 'test-pattern',
        type: 'pattern',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test Pattern',
        description: 'Test',
        maxHints: 2,
        sequence: ['🌙', '⭐', '🌙', '⭐'],
        options: ['🌙', '⭐', '☀️'],
        correctAnswer: '🌙',
      };

      const answer = '🌙';
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should reject incorrect pattern answer', () => {
      const puzzle: Puzzle = {
        id: 'test-pattern',
        type: 'pattern',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test Pattern',
        description: 'Test',
        maxHints: 2,
        sequence: ['🌙', '⭐', '🌙', '⭐'],
        options: ['🌙', '⭐', '☀️'],
        correctAnswer: '🌙',
      };

      const answer = '⭐';
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });
  });

  describe('Sequence Puzzle Validator', () => {
    it('should validate correct sequence', () => {
      const puzzle: Puzzle = {
        id: 'test-sequence',
        type: 'sequence',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Sequence',
        description: 'Test',
        maxHints: 2,
        numbers: [1, 2, 3, null, 8],
        solution: [5],
        rule: 'Fibonacci',
      };

      const answer = [5];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should reject incorrect sequence', () => {
      const puzzle: Puzzle = {
        id: 'test-sequence',
        type: 'sequence',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Sequence',
        description: 'Test',
        maxHints: 2,
        numbers: [1, 2, 3, null, 8],
        solution: [5],
        rule: 'Fibonacci',
      };

      const answer = [4];
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle different array lengths', () => {
      const puzzle: Puzzle = {
        id: 'test-sequence',
        type: 'sequence',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Sequence',
        description: 'Test',
        maxHints: 2,
        numbers: [1, 2, 3],
        solution: [4, 5],
        rule: 'Sequential',
      };

      const answer = [4];
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle empty arrays', () => {
      const puzzle: Puzzle = {
        id: 'test-sequence',
        type: 'sequence',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test Sequence',
        description: 'Test',
        maxHints: 2,
        numbers: [],
        solution: [],
        rule: 'Empty',
      };

      const answer: number[] = [];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });
  });

  describe('Deduction Puzzle Validator', () => {
    it('should validate correct deduction', () => {
      const puzzle: Puzzle = {
        id: 'test-deduction',
        type: 'deduction',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test Deduction',
        description: 'Test',
        maxHints: 1,
        clues: ['Alice has Red', 'Bob has Blue'],
        grid: { rows: ['Alice', 'Bob'], cols: ['Red', 'Blue'] },
        solution: { Alice: 'Red', Bob: 'Blue' },
      };

      const answer = { Alice: 'Red', Bob: 'Blue' };
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should reject incorrect deduction', () => {
      const puzzle: Puzzle = {
        id: 'test-deduction',
        type: 'deduction',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test Deduction',
        description: 'Test',
        maxHints: 1,
        clues: ['Alice has Red', 'Bob has Blue'],
        grid: { rows: ['Alice', 'Bob'], cols: ['Red', 'Blue'] },
        solution: { Alice: 'Red', Bob: 'Blue' },
      };

      const answer = { Alice: 'Blue', Bob: 'Red' }; // Wrong
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle missing properties', () => {
      const puzzle: Puzzle = {
        id: 'test-deduction',
        type: 'deduction',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test Deduction',
        description: 'Test',
        maxHints: 1,
        clues: ['Alice has Red'],
        grid: { rows: ['Alice', 'Bob'], cols: ['Red', 'Blue'] },
        solution: { Alice: 'Red', Bob: 'Blue' },
      };

      const answer = { Alice: 'Red' }; // Missing Bob
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });
  });

  describe('Binary Puzzle Validator', () => {
    it('should validate correct binary logic', () => {
      const puzzle: Puzzle = {
        id: 'test-binary',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test Binary',
        description: 'Test',
        maxHints: 1,
        gates: [
          { inputs: [true, false], gate: 'AND', expected: false },
          { inputs: [true, true], gate: 'OR', expected: true },
        ],
        solution: [false, true],
      };

      const answer = [false, true];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should reject incorrect binary logic', () => {
      const puzzle: Puzzle = {
        id: 'test-binary',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test Binary',
        description: 'Test',
        maxHints: 1,
        gates: [
          { inputs: [true, false], gate: 'AND', expected: false },
          { inputs: [true, true], gate: 'OR', expected: true },
        ],
        solution: [false, true],
      };

      const answer = [true, false]; // Wrong
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle different array lengths', () => {
      const puzzle: Puzzle = {
        id: 'test-binary',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test Binary',
        description: 'Test',
        maxHints: 1,
        gates: [
          { inputs: [true, false], gate: 'AND', expected: false },
          { inputs: [true, true], gate: 'OR', expected: true },
        ],
        solution: [false, true],
      };

      const answer = [false]; // Missing one
      expect(validatePuzzle(puzzle, answer)).toBe(false);
    });

    it('should handle all true', () => {
      const puzzle: Puzzle = {
        id: 'test-binary',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test Binary',
        description: 'Test',
        maxHints: 1,
        gates: [
          { inputs: [true, true], gate: 'AND', expected: true },
          { inputs: [true, true], gate: 'AND', expected: true },
        ],
        solution: [true, true],
      };

      const answer = [true, true];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should handle all false', () => {
      const puzzle: Puzzle = {
        id: 'test-binary',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test Binary',
        description: 'Test',
        maxHints: 1,
        gates: [
          { inputs: [false, false], gate: 'AND', expected: false },
          { inputs: [false, false], gate: 'AND', expected: false },
        ],
        solution: [false, false],
      };

      const answer = [false, false];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });
  });

  describe('Universal Validator', () => {
    it('should correctly route to matrix validator', () => {
      const puzzle: Puzzle = {
        id: 'test',
        type: 'matrix',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test',
        description: 'Test',
        maxHints: 3,
        grid: [[1, 2], [3, 4]],
        solution: [[1, 2], [3, 4]],
        rules: [],
      };
      const answer = [[1, 2], [3, 4]];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should correctly route to pattern validator', () => {
      const puzzle: Puzzle = {
        id: 'test',
        type: 'pattern',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test',
        description: 'Test',
        maxHints: 2,
        sequence: ['🌙'],
        options: ['🌙', '⭐'],
        correctAnswer: '🌙',
      };
      const answer = '🌙';
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should correctly route to sequence validator', () => {
      const puzzle: Puzzle = {
        id: 'test',
        type: 'sequence',
        difficulty: 'easy',
        date: '2026-02-14',
        title: 'Test',
        description: 'Test',
        maxHints: 2,
        numbers: [1, 2, 3],
        solution: [4],
        rule: 'Sequential',
      };
      const answer = [4];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should correctly route to deduction validator', () => {
      const puzzle: Puzzle = {
        id: 'test',
        type: 'deduction',
        difficulty: 'medium',
        date: '2026-02-14',
        title: 'Test',
        description: 'Test',
        maxHints: 1,
        clues: ['Alice has Red'],
        grid: { rows: ['Alice'], cols: ['Red'] },
        solution: { Alice: 'Red' },
      };
      const answer = { Alice: 'Red' };
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should correctly route to binary validator', () => {
      const puzzle: Puzzle = {
        id: 'test',
        type: 'binary',
        difficulty: 'hard',
        date: '2026-02-14',
        title: 'Test',
        description: 'Test',
        maxHints: 1,
        gates: [{ inputs: [true, false], gate: 'AND', expected: false }],
        solution: [false],
      };
      const answer = [false];
      expect(validatePuzzle(puzzle, answer)).toBe(true);
    });

    it('should handle invalid puzzle type', () => {
      const puzzle = {
        type: 'invalid',
        solution: 'test',
      };
      const answer = 'test';
      expect(validatePuzzle(puzzle as any, answer)).toBe(false);
    });
  });
});