import request from 'supertest';
import { createApp } from '../src/app';

function authHeaders(token: string) { return { Authorization: `Bearer ${token}` }; }

describe('Events', () => {
	const { app, httpServer } = createApp();
	afterAll(() => { httpServer.close(); });

	let token = '';
	beforeAll(async () => {
		const email = `evt${Date.now()}@t.local`;
		await request(app).post('/api/auth/register').send({ email, password: 'Pass1234!', firstName: 'E', lastName: 'U' });
		const res = await request(app).post('/api/auth/login').send({ email, password: 'Pass1234!' });
		token = res.body.token;
	});

	test('list empty then create event', async () => {
		const list = await request(app).get('/api/events').set(authHeaders(token));
		expect(list.status).toBe(200);
		const create = await request(app).post('/api/events').set(authHeaders(token)).send({ title: 'Ping', severity: 'LOW', location: { coordinates: [9.1, 38.7] } });
		expect(create.status).toBe(201);
		const list2 = await request(app).get('/api/events').set(authHeaders(token));
		expect(list2.body.length).toBeGreaterThanOrEqual(1);
	});
});