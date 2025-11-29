import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    clearFilters,
    setCurrentTransaction,
} from '../store/slices/transactionSlice';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import { Transaction, TransactionFormData } from '../types';

const Transactions: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { transactions, loading, pagination, filters, currentTransaction } = useAppSelector(
        (state) => state.transactions
    );
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadTransactions();
    }, [isAuthenticated, navigate, filters, pagination.page]);

    const loadTransactions = () => {
        dispatch(
            fetchTransactions({
                page: pagination.page,
                limit: 10,
                category: filters.category !== 'all' ? filters.category : undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
                search: filters.search || undefined,
            })
        );
    };

    const handleAddTransaction = () => {
        dispatch(setCurrentTransaction(null));
        setIsModalOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        dispatch(setCurrentTransaction(transaction));
        setIsModalOpen(true);
    };

    const handleDeleteTransaction = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await dispatch(deleteTransaction(id));
            loadTransactions();
        }
    };

    const handleSubmitTransaction = async (data: TransactionFormData) => {
        if (currentTransaction) {
            await dispatch(updateTransaction({ id: currentTransaction._id, data }));
        } else {
            await dispatch(createTransaction(data));
        }
        setIsModalOpen(false);
        loadTransactions();
    };

    const handlePageChange = (_newPage: number) => {
        dispatch(setFilters({ ...filters }));
        // In a real app, you'd update pagination state here
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                            <p className="text-gray-600 mt-2">Manage all your income and expenses</p>
                        </div>
                        <button onClick={handleAddTransaction} className="btn btn-primary">
                            + Add Transaction
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <FilterBar
                            category={filters.category}
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            search={filters.search}
                            onCategoryChange={(category) => dispatch(setFilters({ category }))}
                            onStartDateChange={(startDate) => dispatch(setFilters({ startDate }))}
                            onEndDateChange={(endDate) => dispatch(setFilters({ endDate }))}
                            onSearchChange={(search) => dispatch(setFilters({ search }))}
                            onClearFilters={() => dispatch(clearFilters())}
                        />
                    </div>

                    {/* Transactions List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                            <p className="text-gray-600 mb-6">
                                Start tracking your finances by adding your first transaction
                            </p>
                            <button onClick={handleAddTransaction} className="btn btn-primary">
                                Add Transaction
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {transactions.map((transaction) => (
                                    <TransactionCard
                                        key={transaction._id}
                                        transaction={transaction}
                                        onEdit={handleEditTransaction}
                                        onDelete={handleDeleteTransaction}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="mt-8 flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-700 px-4">
                                        Page {pagination.page} of {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitTransaction}
                transaction={currentTransaction}
                loading={loading}
            />
        </>
    );
};

export default Transactions;
