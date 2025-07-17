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

// --- Server Startup ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
