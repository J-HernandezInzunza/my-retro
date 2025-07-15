import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

import { initSocketServer } from './core/socket';
import apiRoutes from './routes/api';

// --- Server Initialization ---
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Socket.io Initialization ---
initSocketServer(httpServer);

// --- Server Startup ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;
