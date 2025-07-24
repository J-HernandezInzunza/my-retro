import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';

import { createSocketServer, handleSocketConnection } from './core/socket';
import swaggerSpec from './core/swagger';
import healthcheckRouter from './health.routes';

import retrospectiveBoardRouter from '../slices/retrospective-board/retrospective-board.routes';
import userManagementRouter from '../slices/user-management/api/user-management.routes';
import userSessionRouter from '../slices/user-session/api/user-session.routes';
import userSessionHttpMiddleware from '../slices/user-session/api/user-session-http.middleware';
import userSessionSocketMiddleware from '../slices/user-session/api/user-session-socket.middleware';
import UserSessionCleanupScheduler from '../slices/user-session/business/user-session-cleanup.scheduler';
import teamManagementRouter from '../slices/team-management/api/team-management.routes';

// --- Server Initialization ---
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- API Documentation + Health Check Routes ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-health', healthcheckRouter);

// --- API Routes ---
app.use(userSessionHttpMiddleware); 
app.use('/api/user-session', userSessionRouter);
app.use('/api/users', userManagementRouter);
app.use('/api/retrospective', retrospectiveBoardRouter);
app.use('/api/teams', teamManagementRouter);

// --- Socket.io Initialization ---
// Create Socket.IO server, register middleware and connection handler
const io = createSocketServer(httpServer);
io.use(userSessionSocketMiddleware);
io.on('connection', (socket) => handleSocketConnection(io, socket));

// --- Session Cleanup Scheduler ---
// Start session cleanup job (runs every 30 minutes, cleans sessions inactive for 60+ minutes)
UserSessionCleanupScheduler.start('*/30 * * * *', 60);

// --- Server Startup ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  UserSessionCleanupScheduler.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  UserSessionCleanupScheduler.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
