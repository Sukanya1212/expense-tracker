import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// Keep original route and provide a compatibility alias `/api/expenses`
app.use(['/api/transactions', '/api/expenses'], transactionRoutes);

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Expense Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// MongoDB Connection
const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 API URL: http://localhost:${PORT}/api`);
    });
};

startServer();

export default app;
