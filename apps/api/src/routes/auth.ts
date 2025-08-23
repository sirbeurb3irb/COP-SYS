import { Router } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/auth';

const prisma = new PrismaClient();
export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
	const { email, password, firstName, lastName, role } = req.body as {
		email: string; password: string; firstName: string; lastName: string; role?: Role
	};
	if (!email || !password || !firstName || !lastName) return res.status(400).json({ message: 'Missing fields' });
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(409).json({ message: 'Email already used' });
	const hashed = await argon2.hash(password);
	const user = await prisma.user.create({ data: { email, password: hashed, firstName, lastName, role: role || 'OPERATOR' } });
	res.json({ id: user.id, email: user.email });
});

authRouter.post('/login', async (req, res) => {
	const { email, password } = req.body as { email: string; password: string };
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });
	const valid = await argon2.verify(user.password, password);
	if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
	const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
	res.json({ token });
});

authRouter.get('/me', authenticateJWT, async (req, res) => {
	const userId = (req as any).user?.userId as string;
	const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
	res.json(user);
});