import client from 'prom-client';
import { Router } from 'express';

export const register = new client.Registry();
export const httpRequestsTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status'] as const,
	registers: [register],
});
export const httpRequestDuration = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
	labelNames: ['method', 'route', 'status'] as const,
	registers: [register],
});

export function initMetrics() {
	client.collectDefaultMetrics({ register });
}

export const metricsRouter = Router();
metricsRouter.get('/', async (_req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(await register.metrics());
});