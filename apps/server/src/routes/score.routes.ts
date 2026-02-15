import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateScoreSubmission, validateDateFormat } from '../middleware/validation';


const router = Router();
const prisma = new PrismaClient();

// Submit daily score (batched)
router.post(
  '/submit',
  validateDateFormat,
  validateScoreSubmission,
  async (req, res) => {

  try {
    const { userId, scores } = req.body;

    if (!Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ error: 'Invalid scores data' });
    }

    // Batch insert/update
    const operations = scores.map((score: any) =>
      prisma.dailyScore.upsert({
        where: {
          userId_date: {
            userId,
            date: new Date(score.date),
          },
        },
        update: {
          score: score.score,
          timeTaken: score.timeTaken,
          hintsUsed: score.hintsUsed,
          completed: score.completed,
        },
        create: {
          userId,
          date: new Date(score.date),
          puzzleId: score.puzzleId,
          puzzleType: score.puzzleType,
          score: score.score,
          timeTaken: score.timeTaken,
          hintsUsed: score.hintsUsed,
          completed: score.completed,
        },
      })
    );

    await prisma.$transaction(operations);

    // Update user stats
    const totalPuzzles = await prisma.dailyScore.count({
      where: { userId, completed: true },
    });

    const avgTime = await prisma.dailyScore.aggregate({
      where: { userId, completed: true },
      _avg: { timeTaken: true },
    });

    await prisma.userStats.update({
      where: { userId },
      data: {
        puzzlesSolved: totalPuzzles,
        avgSolveTime: avgTime._avg.timeTaken || 0,
      },
    });

    res.json({ success: true, synced: scores.length });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ error: 'Failed to submit scores' });
  }
});

// Get user scores for a date range
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const scores = await prisma.dailyScore.findMany({
      where: {
        userId,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(scores);
  } catch (error) {
    console.error('Score fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

export default router;