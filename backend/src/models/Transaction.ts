import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Food' | 'Travel' | 'Rent' | 'Shopping' | 'Salary' | 'Other';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    date: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Transaction type is required']
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0']
        },
        category: {
            type: String,
            enum: ['Food', 'Travel', 'Rent', 'Shopping', 'Salary', 'Other'],
            required: [true, 'Category is required']
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now
        },
        note: {
            type: String,
            trim: true,
            maxlength: [200, 'Note cannot exceed 200 characters']
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
