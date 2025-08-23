import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';

const prisma = new PrismaClient();

export function eventRouter(io: SocketIOServer) {
	const router = Router();

	router.get('/', async (_req, res) => {
		const events = await prisma.event.findMany({ orderBy: { occurredAt: 'desc' }, take: 200 });
		res.json(events);
	});

	router.post('/', async (req, res) => {
		const userId = (req as any).user?.userId as string;
		const { title, description, severity, location, unitId } = req.body as any;
		if (!title || !location) return res.status(400).json({ message: 'Missing fields' });
		const event = await prisma.event.create({ data: { title, description, severity, location, unitId, createdById: userId } });
		io.emit('event:new', event);
		res.status(201).json(event);
	});

	return router;
}