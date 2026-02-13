export const validateMatrixPuzzle = (puzzle, userGrid) => {
    if (puzzle.type !== 'matrix')
        return false;
    const { solution } = puzzle;
    // Check if grids match
    for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[i].length; j++) {
            if (userGrid[i][j] !== solution[i][j]) {
                return false;
            }
        }
    }
    return true;
};
export const validatePatternPuzzle = (puzzle, userAnswer) => {
    if (puzzle.type !== 'pattern')
        return false;
    return userAnswer === puzzle.correctAnswer;
};
export const validateSequencePuzzle = (puzzle, userAnswers) => {
    if (puzzle.type !== 'sequence')
        return false;
    const { solution } = puzzle;
    if (userAnswers.length !== solution.length)
        return false;
    return userAnswers.every((ans, i) => ans === solution[i]);
};
export const validateDeductionPuzzle = (puzzle, userSolution) => {
    if (puzzle.type !== 'deduction')
        return false;
    const { solution } = puzzle;
    for (const person in solution) {
        if (userSolution[person] !== solution[person]) {
            return false;
        }
    }
    return true;
};
export const validateBinaryPuzzle = (puzzle, userAnswers) => {
    if (puzzle.type !== 'binary')
        return false;
    const { solution } = puzzle;
    if (userAnswers.length !== solution.length)
        return false;
    return userAnswers.every((ans, i) => ans === solution[i]);
};
// Universal validator
export const validatePuzzle = (puzzle, userAnswer) => {
    switch (puzzle.type) {
        case 'matrix':
            return validateMatrixPuzzle(puzzle, userAnswer);
        case 'pattern':
            return validatePatternPuzzle(puzzle, userAnswer);
        case 'sequence':
            return validateSequencePuzzle(puzzle, userAnswer);
        case 'deduction':
            return validateDeductionPuzzle(puzzle, userAnswer);
        case 'binary':
            return validateBinaryPuzzle(puzzle, userAnswer);
        default:
            return false;
    }
};
// Calculate score based on time, hints, and difficulty
export const calculateScore = (timeTaken, hintsUsed, difficulty) => {
    const baseScore = {
        easy: 100,
        medium: 200,
        hard: 300,
    };
    let score = baseScore[difficulty];
    // Time bonus (faster = more points, max 5 minutes)
    const maxTime = 300; // 5 minutes
    const timeBonus = Math.max(0, ((maxTime - timeTaken) / maxTime) * 100);
    score += Math.floor(timeBonus);
    // Hint penalty (-20 points per hint)
    score -= hintsUsed * 20;
    return Math.max(0, score);
};
