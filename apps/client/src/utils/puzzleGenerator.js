import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
// Enable dayOfYear plugin
dayjs.extend(dayOfYear);
// Deterministic random number generator from seed
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}
// Generate seed from date
export const generateSeedFromDate = (date) => {
    const hash = CryptoJS.SHA256(date).toString();
    return parseInt(hash.substring(0, 8), 16);
};
// Get puzzle type for a given date (rotates through 5 types)
export const getPuzzleTypeForDate = (date) => {
    const types = ['matrix', 'pattern', 'sequence', 'deduction', 'binary'];
    const dayOfYear = dayjs(date).dayOfYear();
    return types[dayOfYear % 5];
};
// Generate Matrix Puzzle (Sudoku-like 4x4)
const generateMatrixPuzzle = (seed, date) => {
    const rng = new SeededRandom(seed);
    // Generate a simple 4x4 valid solution
    const solution = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 3, 4, 1],
        [4, 1, 2, 3],
    ];
    // Shuffle rows and columns to create variation
    const shuffledRows = rng.shuffle([0, 1, 2, 3]);
    const finalSolution = shuffledRows.map(i => solution[i]);
    // Create puzzle by removing some numbers (30-50% filled)
    const grid = finalSolution.map(row => [...row]);
    const cellsToRemove = rng.nextInt(8, 12);
    for (let i = 0; i < cellsToRemove; i++) {
        const row = rng.nextInt(0, 3);
        const col = rng.nextInt(0, 3);
        grid[row][col] = 0; // 0 means empty
    }
    return {
        id: `matrix-${date}`,
        type: 'matrix',
        difficulty: cellsToRemove > 10 ? 'hard' : cellsToRemove > 8 ? 'medium' : 'easy',
        date,
        title: '4x4 Number Grid',
        description: 'Fill in the missing numbers. Each row and column must contain 1, 2, 3, and 4 exactly once.',
        maxHints: 3,
        grid,
        solution: finalSolution,
        rules: [
            'Each row must contain 1, 2, 3, 4',
            'Each column must contain 1, 2, 3, 4',
            'No repeating numbers in any row or column',
        ],
    };
};
// Generate Pattern Puzzle
const generatePatternPuzzle = (seed, date) => {
    const rng = new SeededRandom(seed);
    const patterns = [
        {
            sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
            options: ['🔵', '🔴', '🟢', '🟡'],
            correctAnswer: '🔵',
        },
        {
            sequence: ['⬛', '⬜', '⬛', '⬛', '⬜', '⬜', '⬛', '⬛', '⬛', '?'],
            options: ['⬜', '⬛', '🟦', '🟥'],
            correctAnswer: '⬜',
        },
        {
            sequence: ['🔺', '🔺', '🔻', '🔺', '🔺', '🔺', '🔻', '?'],
            options: ['🔺', '🔻', '🔶', '🔷'],
            correctAnswer: '🔺',
        },
    ];
    const chosen = patterns[rng.nextInt(0, patterns.length - 1)];
    const shuffledOptions = rng.shuffle(chosen.options);
    return {
        id: `pattern-${date}`,
        type: 'pattern',
        difficulty: 'medium',
        date,
        title: 'Pattern Recognition',
        description: 'What comes next in the sequence?',
        maxHints: 2,
        sequence: chosen.sequence,
        options: shuffledOptions,
        correctAnswer: chosen.correctAnswer,
    };
};
// Generate Sequence Puzzle
const generateSequencePuzzle = (seed, date) => {
    const rng = new SeededRandom(seed);
    const sequenceTypes = [
        {
            numbers: [2, 4, 6, null, 10, 12],
            solution: [8],
            rule: 'Even numbers sequence (+2)',
        },
        {
            numbers: [1, 1, 2, 3, 5, null, 13],
            solution: [8],
            rule: 'Fibonacci sequence',
        },
        {
            numbers: [3, 6, 12, null, 48],
            solution: [24],
            rule: 'Each number doubles',
        },
        {
            numbers: [100, 50, null, 12.5],
            solution: [25],
            rule: 'Each number halves',
        },
    ];
    const chosen = sequenceTypes[rng.nextInt(0, sequenceTypes.length - 1)];
    return {
        id: `sequence-${date}`,
        type: 'sequence',
        difficulty: 'easy',
        date,
        title: 'Number Sequence',
        description: 'Find the missing number in the sequence',
        maxHints: 2,
        numbers: chosen.numbers,
        solution: chosen.solution,
        rule: chosen.rule,
    };
};
// Generate Deduction Puzzle (Einstein-style mini)
const generateDeductionPuzzle = (seed, date) => {
    const rng = new SeededRandom(seed);
    const people = ['Alice', 'Bob', 'Carol'];
    const colors = ['Red', 'Blue', 'Green'];
    // Create a valid solution
    const shuffledColors = rng.shuffle([...colors]);
    const solution = {};
    people.forEach((person, i) => {
        solution[person] = shuffledColors[i];
    });
    // Generate clues based on solution
    const clues = [
        `${people[0]} does not have ${shuffledColors[1]}`,
        `${people[1]} has ${shuffledColors[1]}`,
        `${people[2]} does not have ${shuffledColors[0]}`,
    ];
    return {
        id: `deduction-${date}`,
        type: 'deduction',
        difficulty: 'medium',
        date,
        title: 'Logic Deduction',
        description: 'Match each person with their color based on the clues',
        maxHints: 1,
        clues,
        grid: {
            rows: people,
            cols: colors,
        },
        solution,
    };
};
// Generate Binary Logic Puzzle
const generateBinaryPuzzle = (seed, date) => {
    const rng = new SeededRandom(seed);
    const gates = [
        {
            inputs: [true, false],
            gate: 'AND',
            expected: false,
        },
        {
            inputs: [true, true],
            gate: 'OR',
            expected: true,
        },
        {
            inputs: [true, false],
            gate: 'XOR',
            expected: true,
        },
    ];
    const solution = gates.map(g => g.expected);
    return {
        id: `binary-${date}`,
        type: 'binary',
        difficulty: 'hard',
        date,
        title: 'Logic Gates',
        description: 'Determine the output of each logic gate',
        maxHints: 1,
        gates,
        solution,
    };
};
// Main generator function
export const generateDailyPuzzle = (date) => {
    const seed = generateSeedFromDate(date);
    const type = getPuzzleTypeForDate(date);
    switch (type) {
        case 'matrix':
            return generateMatrixPuzzle(seed, date);
        case 'pattern':
            return generatePatternPuzzle(seed, date);
        case 'sequence':
            return generateSequencePuzzle(seed, date);
        case 'deduction':
            return generateDeductionPuzzle(seed, date);
        case 'binary':
            return generateBinaryPuzzle(seed, date);
        default:
            return generateMatrixPuzzle(seed, date);
    }
};
// Get today's puzzle
export const getTodaysPuzzle = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return generateDailyPuzzle(today);
};
