import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
	userId: string;
	role: string;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
	const token = authHeader.replace('Bearer ', '');
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
		(req as any).user = decoded;
		next();
	} catch {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export function authorizeRoles(...roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user as JwtPayload | undefined;
		if (!user) return res.status(401).json({ message: 'Unauthorized' });
		if (!roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
		next();
	};
}