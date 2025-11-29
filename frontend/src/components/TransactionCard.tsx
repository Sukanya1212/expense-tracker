import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';

interface TransactionCardProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onEdit, onDelete }) => {
    const isIncome = transaction.type === 'income';

    const formatAmount = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            Food: '🍔',
            Travel: '✈️',
            Rent: '🏠',
            Shopping: '🛍️',
            Salary: '💼',
            Other: '📌',
        };
        return icons[category] || '📌';
    };

    return (
        <div className="card hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    {/* Category Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {getCategoryIcon(transaction.category)}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{transaction.category}</h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${isIncome
                                        ? 'bg-success-100 text-success-700'
                                        : 'bg-danger-100 text-danger-700'
                                    }`}
                            >
                                {transaction.type}
                            </span>
                        </div>
                        {transaction.note && (
                            <p className="text-sm text-gray-600 mt-1">{transaction.note}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                        <p
                            className={`text-2xl font-bold ${isIncome ? 'text-success-600' : 'text-danger-600'
                                }`}
                        >
                            {isIncome ? '+' : '-'} {formatAmount(transaction.amount)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(transaction._id)}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
