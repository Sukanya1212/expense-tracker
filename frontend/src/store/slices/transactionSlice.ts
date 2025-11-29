import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import {
    TransactionState,
    Transaction,
    TransactionFormData,
    ApiResponse,
    PaginationParams,
} from '../../types';

const initialState: TransactionState = {
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        pages: 0,
    },
    filters: {
        category: 'all',
        startDate: '',
        endDate: '',
        search: '',
    },
    stats: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchAll',
    async (params: PaginationParams, { rejectWithValue }) => {
        try {
            const response = await api.get<
                ApiResponse<{ transactions: Transaction[]; pagination: any }>
            >('/transactions', { params });
            return response.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const fetchDashboardStats = createAsyncThunk(
    'transactions/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<any>>('/transactions/stats/dashboard');
            return response.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/create',
    async (data: TransactionFormData, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
            return response.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async ({ id, data }: { id: string; data: Partial<TransactionFormData> }, { rejectWithValue }) => {
        try {
            const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
            return response.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/transactions/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<TransactionState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: 'all',
                startDate: '',
                endDate: '',
                search: '',
            };
        },
        setCurrentTransaction: (state, action: PayloadAction<Transaction | null>) => {
            state.currentTransaction = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch transactions
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch stats
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create transaction
        builder
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions.unshift(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update transaction
        builder
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.transactions.findIndex((t) => t._id === action.payload._id);
                if (index !== -1) {
                    state.transactions[index] = action.payload;
                }
                state.currentTransaction = null;
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete transaction
        builder
            .addCase(deleteTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = state.transactions.filter((t) => t._id !== action.payload);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, setCurrentTransaction, clearError } =
    transactionSlice.actions;
export default transactionSlice.reducer;
