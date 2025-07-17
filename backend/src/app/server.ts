import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';

import { initSocketServer } from './core/socket';
import swaggerSpec from './core/swagger';
import coreRoutes from './routes/api';
import userManagementRoutes from '../slices/user-management/user-management.routes';
import retrospectiveBoardRoutes from '../slices/retrospective-board/retrospective-board.routes';

// --- Server Initialization ---
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- API Documentation Route ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Routes ---
app.use('/api', coreRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/retrospective', retrospectiveBoardRoutes);

// --- Socket.io Initialization ---
initSocketServer(httpServer);

// --- Server Startup ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
