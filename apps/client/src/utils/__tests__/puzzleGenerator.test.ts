import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import {
  generateSeedFromDate,
  getPuzzleTypeForDate,
  generateDailyPuzzle,
  getTodaysPuzzle,
} from '../puzzleGenerator';

dayjs.extend(dayOfYear);

describe('Puzzle Generator', () => {
  describe('generateSeedFromDate', () => {
    it('should generate consistent seed for same date', () => {
      const date = '2026-02-14';
      const seed1 = generateSeedFromDate(date);
      const seed2 = generateSeedFromDate(date);
      
      expect(seed1).toBe(seed2);
      expect(typeof seed1).toBe('number');
    });

    it('should generate different seeds for different dates', () => {
      const seed1 = generateSeedFromDate('2026-02-14');
      const seed2 = generateSeedFromDate('2026-02-15');
      
      expect(seed1).not.toBe(seed2);
    });

    it('should generate positive numbers', () => {
      const seed = generateSeedFromDate('2026-02-14');
      expect(seed).toBeGreaterThan(0);
    });
  });

  describe('getPuzzleTypeForDate', () => {
    it('should rotate puzzle types based on day of year', () => {
      const types = ['matrix', 'pattern', 'sequence', 'deduction', 'binary'];
      
      // Test 5 consecutive days
      const date1 = dayjs('2026-02-01');
      for (let i = 0; i < 5; i++) {
        const date = date1.add(i, 'day').format('YYYY-MM-DD');
        const type = getPuzzleTypeForDate(date);
        expect(types).toContain(type);
      }
    });

    it('should return same type for same date', () => {
      const date = '2026-02-14';
      const type1 = getPuzzleTypeForDate(date);
      const type2 = getPuzzleTypeForDate(date);
      
      expect(type1).toBe(type2);
    });

    it('should cycle through all 5 types', () => {
      const types = new Set<string>();
      const startDate = dayjs('2026-01-01');
      
      // Test 10 days to ensure we hit all 5 types
      for (let i = 0; i < 10; i++) {
        const date = startDate.add(i, 'day').format('YYYY-MM-DD');
        types.add(getPuzzleTypeForDate(date));
      }
      
      expect(types.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe('generateDailyPuzzle', () => {
    it('should generate consistent puzzle for same date', () => {
      const date = '2026-02-14';
      const puzzle1 = generateDailyPuzzle(date);
      const puzzle2 = generateDailyPuzzle(date);
      
      expect(puzzle1.id).toBe(puzzle2.id);
      expect(puzzle1.type).toBe(puzzle2.type);
      expect(puzzle1.date).toBe(puzzle2.date);
    });

    it('should include all required fields', () => {
      const puzzle = generateDailyPuzzle('2026-02-14');
      
      expect(puzzle).toHaveProperty('id');
      expect(puzzle).toHaveProperty('type');
      expect(puzzle).toHaveProperty('date');
      expect(puzzle).toHaveProperty('difficulty');
      expect(puzzle).toHaveProperty('title');
      expect(puzzle).toHaveProperty('description');
      expect(puzzle).toHaveProperty('maxHints');
      
      // Type-specific properties
      if (puzzle.type === 'matrix') {
        expect(puzzle).toHaveProperty('grid');
        expect(puzzle).toHaveProperty('solution');
      } else if (puzzle.type === 'pattern') {
        expect(puzzle).toHaveProperty('sequence');
        expect(puzzle).toHaveProperty('correctAnswer');
      } else if (puzzle.type === 'sequence') {
        expect(puzzle).toHaveProperty('numbers');
        expect(puzzle).toHaveProperty('solution');
      } else if (puzzle.type === 'deduction') {
        expect(puzzle).toHaveProperty('clues');
        expect(puzzle).toHaveProperty('solution');
      } else if (puzzle.type === 'binary') {
        expect(puzzle).toHaveProperty('gates');
        expect(puzzle).toHaveProperty('solution');
      }
    });

    it('should generate different puzzles for different dates', () => {
      const puzzle1 = generateDailyPuzzle('2026-02-14');
      const puzzle2 = generateDailyPuzzle('2026-02-15');
      
      expect(puzzle1.id).not.toBe(puzzle2.id);
    });

    it('should generate valid puzzle data for each type', () => {
      const types = ['matrix', 'pattern', 'sequence', 'deduction', 'binary'];
      
      types.forEach((type) => {
        // Find a date that generates this puzzle type
        let date = dayjs('2026-01-01');
        for (let i = 0; i < 365; i++) {
          const testDate = date.add(i, 'day').format('YYYY-MM-DD');
          if (getPuzzleTypeForDate(testDate) === type) {
            const puzzle = generateDailyPuzzle(testDate);
            expect(puzzle.type).toBe(type);
            
            // Verify type-specific properties exist
            if (type === 'matrix' && puzzle.type === 'matrix') {
              expect(puzzle.grid).toBeDefined();
              expect(puzzle.solution).toBeDefined();
            } else if (type === 'pattern' && puzzle.type === 'pattern') {
              expect(puzzle.sequence).toBeDefined();
              expect(puzzle.correctAnswer).toBeDefined();
            } else if (type === 'sequence' && puzzle.type === 'sequence') {
              expect(puzzle.numbers).toBeDefined();
              expect(puzzle.solution).toBeDefined();
            } else if (type === 'deduction' && puzzle.type === 'deduction') {
              expect(puzzle.clues).toBeDefined();
              expect(puzzle.solution).toBeDefined();
            } else if (type === 'binary' && puzzle.type === 'binary') {
              expect(puzzle.gates).toBeDefined();
              expect(puzzle.solution).toBeDefined();
            }
            break;
          }
        }
      });
    });
  });

  describe('getTodaysPuzzle', () => {
    it('should return puzzle for current date', () => {
      const puzzle = getTodaysPuzzle();
      const today = dayjs().format('YYYY-MM-DD');
      
      expect(puzzle.date).toBe(today);
    });

    it('should return consistent puzzle when called multiple times', () => {
      const puzzle1 = getTodaysPuzzle();
      const puzzle2 = getTodaysPuzzle();
      
      expect(puzzle1.id).toBe(puzzle2.id);
    });
  });

  describe('Leap Year Handling', () => {
    it('should handle leap year correctly (2024)', () => {
      const leapYearDate = '2024-02-29';
      const puzzle = generateDailyPuzzle(leapYearDate);
      
      expect(puzzle).toBeDefined();
      expect(puzzle.date).toBe(leapYearDate);
    });

    it('should handle non-leap year correctly (2026)', () => {
      // Feb 29 doesn't exist in 2026
      const nonLeapDate = '2026-03-01';
      const puzzle = generateDailyPuzzle(nonLeapDate);
      
      expect(puzzle).toBeDefined();
      expect(puzzle.date).toBe(nonLeapDate);
    });

    it('should generate 366 unique puzzles in leap year', () => {
      const puzzleIds = new Set<string>();
      const leapYear = '2024';
      
      for (let day = 1; day <= 366; day++) {
        const date = dayjs(`${leapYear}-01-01`).add(day - 1, 'day').format('YYYY-MM-DD');
        const puzzle = generateDailyPuzzle(date);
        puzzleIds.add(puzzle.id);
      }
      
      expect(puzzleIds.size).toBe(366);
    });
  });

  describe('Deterministic Behavior', () => {
    it('should produce identical puzzles across multiple runs', () => {
      const date = '2026-02-14';
      const runs = 10;
      const puzzles = [];
      
      for (let i = 0; i < runs; i++) {
        puzzles.push(generateDailyPuzzle(date));
      }
      
      const firstPuzzle = puzzles[0];
      puzzles.forEach((puzzle) => {
        expect(puzzle.id).toBe(firstPuzzle.id);
        expect(puzzle.type).toBe(firstPuzzle.type);
        
        // Compare type-specific data
        if (firstPuzzle.type === 'matrix' && puzzle.type === 'matrix') {
          expect(JSON.stringify(puzzle.grid)).toBe(JSON.stringify(firstPuzzle.grid));
          expect(JSON.stringify(puzzle.solution)).toBe(JSON.stringify(firstPuzzle.solution));
        } else if (firstPuzzle.type === 'pattern' && puzzle.type === 'pattern') {
          expect(JSON.stringify(puzzle.sequence)).toBe(JSON.stringify(firstPuzzle.sequence));
          expect(puzzle.correctAnswer).toBe(firstPuzzle.correctAnswer);
        } else if (firstPuzzle.type === 'sequence' && puzzle.type === 'sequence') {
          expect(JSON.stringify(puzzle.numbers)).toBe(JSON.stringify(firstPuzzle.numbers));
          expect(JSON.stringify(puzzle.solution)).toBe(JSON.stringify(firstPuzzle.solution));
        } else if (firstPuzzle.type === 'deduction' && puzzle.type === 'deduction') {
          expect(JSON.stringify(puzzle.clues)).toBe(JSON.stringify(firstPuzzle.clues));
          expect(JSON.stringify(puzzle.solution)).toBe(JSON.stringify(firstPuzzle.solution));
        } else if (firstPuzzle.type === 'binary' && puzzle.type === 'binary') {
          expect(JSON.stringify(puzzle.gates)).toBe(JSON.stringify(firstPuzzle.gates));
          expect(JSON.stringify(puzzle.solution)).toBe(JSON.stringify(firstPuzzle.solution));
        }
      });
    });
  });
});