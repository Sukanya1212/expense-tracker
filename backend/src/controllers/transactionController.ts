import { Response } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions  
// @access  Private
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, startDate, endDate, search, page = '1', limit = '10' } = req.query;

        const query: any = { userId: req.userId };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        // Search in notes
        if (search) {
            query.note = { $regex: search, $options: 'i' };
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching transactions'
        });
    }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching transaction'
        });
    }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, amount, category, date, note } = req.body;

        // Validation
        if (!type || !amount || !category || !date) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields: type, amount, category, date'
            });
            return;
        }

        const transaction = await Transaction.create({
            userId: req.userId,
            type,
            amount,
            category,
            date,
            note
        });

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error: any) {
        console.error('Create transaction error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating transaction'
        });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, amount, category, date, note } = req.body;

        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
            return;
        }

        // Update fields
        if (type) transaction.type = type;
        if (amount) transaction.amount = amount;
        if (category) transaction.category = category;
        if (date) transaction.date = date;
        if (note !== undefined) transaction.note = note;

        await transaction.save();

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error: any) {
        console.error('Update transaction error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating transaction'
        });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting transaction'
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/transactions/stats/dashboard
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const transactions = await Transaction.find({ userId: req.userId });

        // Calculate totals
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        // Category-wise breakdown
        const categoryStats = transactions.reduce((acc: any, t) => {
            if (!acc[t.category]) {
                acc[t.category] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[t.category].income += t.amount;
            } else {
                acc[t.category].expense += t.amount;
            }
            return acc;
        }, {});

        // Monthly breakdown (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId as string),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance,
                categoryStats,
                monthlyData
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};
