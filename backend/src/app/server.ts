import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';

import { initSocketServer } from './core/socket';
import swaggerSpec from './core/swagger';
import healthcheckRouter from './health.routes';

import userManagementRouter from '../slices/user-management/user-management.routes';
import retrospectiveBoardRouter from '../slices/retrospective-board/retrospective-board.routes';
import userSessionRouter from '../slices/user-session/api/user-session.routes';
import userSessionMiddleware from '../slices/user-session/api/user-session.middleware';
import SessionCleanupScheduler from '../slices/user-session/business/user-session-cleanup.scheduler';

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
app.use(userSessionMiddleware()); 
app.use('/api/user-session', userSessionRouter);
app.use('/api/users', userManagementRouter);
app.use('/api/retrospective', retrospectiveBoardRouter);

// --- Socket.io Initialization ---
initSocketServer(httpServer);

// --- Session Cleanup Scheduler ---
// Start session cleanup job (runs every 30 minutes, cleans sessions inactive for 60+ minutes)
SessionCleanupScheduler.start('*/30 * * * *', 60);

// --- Server Startup ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  SessionCleanupScheduler.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  SessionCleanupScheduler.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
