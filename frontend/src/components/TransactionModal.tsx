import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Transaction, TransactionFormData, TransactionCategory, TransactionType } from '../types';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => void;
    transaction?: Transaction | null;
    loading?: boolean;
}

const transactionSchema = yup.object().shape({
    type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
    amount: yup
        .number()
        .positive('Amount must be positive')
        .required('Amount is required'),
    category: yup
        .string()
        .oneOf(['Food', 'Travel', 'Rent', 'Shopping', 'Salary', 'Other'])
        .required('Category is required'),
    date: yup.string().required('Date is required'),
    note: yup.string().max(200, 'Note cannot exceed 200 characters'),
});

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    transaction,
    loading = false,
}) => {
    const [formData, setFormData] = useState<TransactionFormData>({
        type: 'expense',
        amount: 0,
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        note: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                category: transaction.category,
                date: new Date(transaction.date).toISOString().split('T')[0],
                note: transaction.note || '',
            });
        } else {
            setFormData({
                type: 'expense',
                amount: 0,
                category: 'Other',
                date: new Date().toISOString().split('T')[0],
                note: '',
            });
        }
        setErrors({});
    }, [transaction, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await transactionSchema.validate(formData, { abortEarly: false });
            onSubmit(formData);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const validationErrors: Record<string, string> = {};
                err.inner.forEach((error) => {
                    if (error.path) {
                        validationErrors[error.path] = error.message;
                    }
                });
                setErrors(validationErrors);
            }
        }
    };

    if (!isOpen) return null;

    const categories: TransactionCategory[] = ['Food', 'Travel', 'Rent', 'Shopping', 'Salary', 'Other'];
    const types: TransactionType[] = ['income', 'expense'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {transaction ? 'Edit Transaction' : 'Add Transaction'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type */}
                    <div>
                        <label className="label">Type *</label>
                        <div className="grid grid-cols-2 gap-3">
                            {types.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, type }))}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${formData.type === type
                                            ? type === 'income'
                                                ? 'bg-success-600 text-white'
                                                : 'bg-danger-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {type === 'income' ? '💰 Income' : '💸 Expense'}
                                </button>
                            ))}
                        </div>
                        {errors.type && <p className="text-danger-600 text-sm mt-1">{errors.type}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="label">Amount *</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="Enter amount"
                            className={`input ${errors.amount ? 'border-danger-500' : ''}`}
                        />
                        {errors.amount && <p className="text-danger-600 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="label">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`input ${errors.category ? 'border-danger-500' : ''}`}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-danger-600 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="label">Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`input ${errors.date ? 'border-danger-500' : ''}`}
                        />
                        {errors.date && <p className="text-danger-600 text-sm mt-1">{errors.date}</p>}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="label">Note (Optional)</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add a note..."
                            className={`input resize-none ${errors.note ? 'border-danger-500' : ''}`}
                        />
                        {errors.note && <p className="text-danger-600 text-sm mt-1">{errors.note}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : transaction ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
