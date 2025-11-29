export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Food' | 'Travel' | 'Rent' | 'Shopping' | 'Salary' | 'Other';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Transaction {
    _id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface TransactionState {
    transactions: Transaction[];
    currentTransaction: Transaction | null;
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
    filters: {
        category: string;
        startDate: string;
        endDate: string;
        search: string;
    };
    stats: {
        totalIncome: number;
        totalExpense: number;
        balance: number;
        categoryStats: Record<string, { income: number; expense: number }>;
        monthlyData: Array<{
            _id: { year: number; month: number; type: TransactionType };
            total: number;
        }>;
    } | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface TransactionFormData {
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    date: string;
    note?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}
