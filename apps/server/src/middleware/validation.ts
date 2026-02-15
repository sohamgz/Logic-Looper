import { Request, Response, NextFunction } from 'express';
import { verifyPuzzleSignature, getMaxScore, getMinTime } from '@logic-looper/shared';

interface ScoreSubmission {
  date: string;
  puzzleId: string;
  puzzleType: string;
  score: number;
  timeTaken: number;
  hintsUsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  signature: string;
}

/**
 * Validate puzzle score submission
 * Prevents tampering and unrealistic scores
 */
export const validateScoreSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const submission: ScoreSubmission = req.body;
  const secret = process.env.PUZZLE_HMAC_SECRET || '';

  // 1. Verify HMAC signature
  const isValidSignature = verifyPuzzleSignature(
    submission.date,
    submission.puzzleId,
    submission.score,
    submission.timeTaken,
    submission.hintsUsed,
    submission.signature,
    secret
  );

  if (!isValidSignature) {
    return res.status(400).json({
      error: 'Invalid signature - score tampering detected',
    });
  }

  // 2. Reject future dates
  const submissionDate = new Date(submission.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (submissionDate > today) {
    return res.status(400).json({
      error: 'Future dates not allowed',
    });
  }

  // 3. Validate score range
  const maxPossibleScore = getMaxScore(submission.difficulty);
  if (submission.score > maxPossibleScore || submission.score < 0) {
    return res.status(400).json({
      error: `Invalid score range. Max: ${maxPossibleScore}`,
    });
  }

  // 4. Validate time taken
  const minRealisticTime = getMinTime(submission.difficulty);
  if (submission.timeTaken < minRealisticTime) {
    return res.status(400).json({
      error: `Unrealistic completion time. Min: ${minRealisticTime}s`,
    });
  }

  // Max time: 1 hour (3600 seconds)
  if (submission.timeTaken > 3600) {
    return res.status(400).json({
      error: 'Time taken exceeds maximum (1 hour)',
    });
  }

  // 5. Validate hints used
  if (submission.hintsUsed < 0 || submission.hintsUsed > 3) {
    return res.status(400).json({
      error: 'Invalid hints count (0-3 allowed)',
    });
  }

  // All validations passed
  next();
};

/**
 * Validate date format
 */
export const validateDateFormat = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date } = req.body;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
    });
  }

  next();
};