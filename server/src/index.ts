import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './common/config/db.js';
import { initJobs } from './jobs/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

// Feature Modules
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/projects/project.routes.js';
import credentialRoutes from './modules/credentials/credential.routes.js';
import envRoutes from './modules/environments/env.routes.js';
import documentRoutes from './modules/documents/document.routes.js';
import userRoutes from './modules/users/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Background Workers / Jobs
initJobs();

// Global Middlewares
app.use(cors()); // Allow cross-origin requests from React frontend
app.use(express.json({ limit: '15mb' })); // Support JSON bodies and base64 documents
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'PigoPiOps Backend API',
    architecture: 'Modular Feature-Based (Controller-Service-Routes)',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// Register Feature Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/environments', envRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

// 404 & Global Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 PigoPiOps API Server running on: http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
