import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authorizeRoles } from '../middleware/auth';

const prisma = new PrismaClient();
export const unitRouter = Router();

unitRouter.get('/', async (_req, res) => {
	const units = await prisma.unit.findMany();
	res.json(units);
});

unitRouter.post('/', authorizeRoles('ADMIN', 'COMMANDER'), async (req, res) => {
	const { name, type, status, location } = req.body as any;
	if (!name || !type) return res.status(400).json({ message: 'Missing fields' });
	const unit = await prisma.unit.create({ data: { name, type, status, location } });
	res.status(201).json(unit);
});

unitRouter.put('/:id', authorizeRoles('ADMIN', 'COMMANDER'), async (req, res) => {
	const { id } = req.params;
	const { name, type, status, location } = req.body as any;
	const unit = await prisma.unit.update({ where: { id }, data: { name, type, status, location } });
	res.json(unit);
});

unitRouter.delete('/:id', authorizeRoles('ADMIN'), async (req, res) => {
	const { id } = req.params;
	await prisma.unit.delete({ where: { id } });
	res.status(204).send();
});