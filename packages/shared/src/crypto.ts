import CryptoJS from 'crypto-js';

/**
 * Generate HMAC signature for puzzle submission
 * This prevents score tampering on the client side
 */
export function generatePuzzleSignature(
  date: string,
  puzzleId: string,
  score: number,
  timeTaken: number,
  hintsUsed: number,
  secret: string
): string {
  const data = `${date}|${puzzleId}|${score}|${timeTaken}|${hintsUsed}`;
  return CryptoJS.HmacSHA256(data, secret).toString();
}

/**
 * Verify puzzle submission signature
 * Returns true if signature is valid
 */
export function verifyPuzzleSignature(
  date: string,
  puzzleId: string,
  score: number,
  timeTaken: number,
  hintsUsed: number,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generatePuzzleSignature(
    date,
    puzzleId,
    score,
    timeTaken,
    hintsUsed,
    secret
  );
  return signature === expectedSignature;
}

/**
 * Get max possible score for a difficulty level
 */
export function getMaxScore(difficulty: 'easy' | 'medium' | 'hard'): number {
  const baseScores = { easy: 100, medium: 200, hard: 300 };
  const maxTimeBonus = 100;
  return baseScores[difficulty] + maxTimeBonus;
}

/**
 * Get minimum realistic time (in seconds) for a puzzle
 */
export function getMinTime(difficulty: 'easy' | 'medium' | 'hard'): number {
  return { easy: 10, medium: 20, hard: 30 }[difficulty];
}