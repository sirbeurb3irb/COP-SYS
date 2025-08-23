import request from 'supertest';
import { createApp } from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth routes', () => {
	const { app, httpServer } = createApp();
	afterAll(async () => {
		httpServer.close();
		await prisma.$disconnect();
	});

	test('register and login', async () => {
		const email = `user${Date.now()}@test.local`;
		await request(app).post('/api/auth/register').send({
			email,
			password: 'Pass1234!',
			firstName: 'Test',
			lastName: 'User',
		});
		const login = await request(app).post('/api/auth/login').send({ email, password: 'Pass1234!' });
		expect(login.status).toBe(200);
		expect(login.body.token).toBeDefined();
		const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
		expect(me.status).toBe(200);
		expect(me.body.email).toBe(email);
	});
});