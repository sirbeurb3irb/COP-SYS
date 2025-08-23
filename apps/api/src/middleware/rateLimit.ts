import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const limiter = new RateLimiterMemory({
	points: Number(process.env.RATE_LIMIT_MAX || 100),
	duration: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000) / 1000,
});

export function rateLimit() {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const key = (req.ip || req.socket.remoteAddress || 'unknown') as string;
			await limiter.consume(key);
			next();
		} catch {
			res.status(429).json({ message: 'Too Many Requests' });
		}
	};
}