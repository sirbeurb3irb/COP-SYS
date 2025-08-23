import { NextFunction, Request, Response } from 'express';
import { httpRequestDuration, httpRequestsTotal } from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
	const startHrTime = process.hrtime();
	res.on('finish', () => {
		const diff = process.hrtime(startHrTime);
		const durationInSeconds = diff[0] + diff[1] / 1e9;
		const route = (req.route && req.route.path) || req.path || 'unknown';
		const labels = { method: req.method, route, status: String(res.statusCode) } as const;
		httpRequestsTotal.inc(labels);
		httpRequestDuration.observe(labels, durationInSeconds);
	});
	next();
}