"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Sync user from client
router.post('/sync', async (req, res) => {
    try {
        const { id, email, name, avatar, provider } = req.body;
        // Upsert user
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name,
                avatar,
                updatedAt: new Date(),
            },
            create: {
                id,
                email,
                name,
                avatar,
                provider,
                stats: {
                    create: {},
                },
            },
        });
        res.json({ success: true, user });
    }
    catch (error) {
        console.error('Auth sync error:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});
// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                stats: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
exports.default = router;
