import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import fs from 'fs';
import path from 'path';
import pinoHttp from 'pino-http';
import { rateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { eventRouter } from './routes/events';
import { unitRouter } from './routes/units';
import { authenticateJWT } from './middleware/auth';
import { metricsRouter, initMetrics } from './metrics';
import { metricsMiddleware } from './middleware/metrics';

export function createApp() {
	const app = express();
	const httpServer: HttpServer = createServer(app);
	const io = new SocketIOServer(httpServer, {
		path: '/ws',
		cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] },
	});

	app.set('trust proxy', 1);
	app.use(helmet());
	app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
	app.use(express.json({ limit: '1mb' }));
	app.use(morgan('combined'));
	app.use(pinoHttp());
	app.use(metricsMiddleware);
	app.use(rateLimit());

	io.on('connection', () => {
		// reserved for future event broadcasting hooks
	});

	const swaggerPath = path.join(process.cwd(), 'src', 'swagger.yaml');
	if (fs.existsSync(swaggerPath)) {
		const doc = yaml.parse(fs.readFileSync(swaggerPath, 'utf8'));
		app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
	}

	initMetrics();
	app.use('/metrics', metricsRouter);

	app.use('/api/auth', authRouter);
	app.use('/api/events', authenticateJWT, eventRouter(io));
	app.use('/api/units', authenticateJWT, unitRouter);

	app.get('/health', (_req, res) => res.json({ status: 'ok' }));
	app.use(errorHandler);

	return { app, httpServer, io };
}