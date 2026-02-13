import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// Get daily leaderboard (top 100)
router.get('/daily', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        const leaderboard = await prisma.dailyScore.findMany({
            where: {
                date: targetDate,
                completed: true,
            },
            take: 100,
            orderBy: [
                { score: 'desc' },
                { timeTaken: 'asc' },
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        res.json(leaderboard);
    }
    catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});
// Get all-time streak leaders
router.get('/streaks', async (req, res) => {
    try {
        const leaders = await prisma.user.findMany({
            take: 100,
            orderBy: {
                streakCount: 'desc',
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                streakCount: true,
                stats: {
                    select: {
                        bestStreak: true,
                    },
                },
            },
        });
        res.json(leaders);
    }
    catch (error) {
        console.error('Streak leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch streak leaderboard' });
    }
});
export default router;
