import express from 'express';
import {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getDashboardStats
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes are protected with auth middleware
router.use(authMiddleware);

// GET /api/transactions/stats/dashboard - Must be before /:id route
router.get('/stats/dashboard', getDashboardStats);

// GET /api/transactions
router.get('/', getTransactions);

// POST /api/transactions
router.post('/', createTransaction);

// GET /api/transactions/:id
router.get('/:id', getTransaction);

// PUT /api/transactions/:id
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

export default router;
