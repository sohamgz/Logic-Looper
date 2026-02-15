import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface SyncEntry {
  date: string;
  score: number;
  timeTaken: number;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzleType: string;
  userAnswer: any;
  hintsUsed: number;
}

router.post('/daily-scores', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { entries }: { entries: SyncEntry[] } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid entries' });
    }

    if (entries.length > 30) {
      return res.status(400).json({ success: false, error: 'Max 30 entries allowed' });
    }

    const results = {
      successful: [] as string[],
      failed: [] as { date: string; errors: string[] }[]
    };

    for (const entry of entries) {
      try {
        // Basic validation
        if (!entry.date || entry.score < 0 || entry.timeTaken <= 0) {
          results.failed.push({
            date: entry.date,
            errors: ['Invalid score or time']
          });
          continue;
        }

        await prisma.dailyScore.upsert({
          where: {
            userId_date: {
              userId: userId,
              date: new Date(entry.date)
            }
          },
          update: {
            score: entry.score,
            timeTaken: entry.timeTaken,
            hintsUsed: entry.hintsUsed
          },
          create: {
            userId: userId,
            date: new Date(entry.date),
            score: entry.score,
            timeTaken: entry.timeTaken,
            puzzleType: entry.puzzleType,
            puzzleId: entry.puzzleType,
            hintsUsed: entry.hintsUsed
          }
        });

        results.successful.push(entry.date);

      } catch (error) {
        results.failed.push({
          date: entry.date,
          errors: ['Database error']
        });
      }
    }

    await updateUserStats(userId);

    return res.status(200).json({
      success: true,
      synced: results.successful.length,
      failed: results.failed.length,
      details: results
    });

  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

async function updateUserStats(userId: string) {
  const userScores = await prisma.dailyScore.findMany({
    where: { userId: userId },
    orderBy: { date: 'desc' }
  });

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < userScores.length; i++) {
    const scoreDate = new Date(userScores[i].date);
    scoreDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (scoreDate.getTime() === expectedDate.getTime()) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const totalTime = userScores.reduce((sum, score) => sum + score.timeTaken, 0);
  const avgSolveTime = userScores.length > 0 ? totalTime / userScores.length : 0;

  await prisma.userStats.upsert({
    where: { userId: userId },
    update: {
      puzzlesSolved: userScores.length,
      bestStreak: Math.max(longestStreak, currentStreak),
      avgSolveTime: avgSolveTime
    },
    create: {
      userId: userId,
      puzzlesSolved: userScores.length,
      bestStreak: currentStreak,
      avgSolveTime: avgSolveTime
    }
  });
}

export default router;
