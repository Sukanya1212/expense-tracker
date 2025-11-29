import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchDashboardStats } from '../store/slices/transactionSlice';
import StatsCard from '../components/StatsCard';
import Navbar from '../components/Navbar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { stats, loading } = useAppSelector((state) => state.transactions);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        dispatch(fetchDashboardStats());
    }, [dispatch, isAuthenticated, navigate]);

    if (loading || !stats) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </>
        );
    }

    // Prepare monthly chart data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyIncome: number[] = new Array(12).fill(0);
    const monthlyExpense: number[] = new Array(12).fill(0);

    stats.monthlyData.forEach((item) => {
        const monthIndex = item._id.month - 1;
        if (item._id.type === 'income') {
            monthlyIncome[monthIndex] = item.total;
        } else {
            monthlyExpense[monthIndex] = item.total;
        }
    });

    const barChartData = {
        labels: monthNames,
        datasets: [
            {
                label: 'Income',
                data: monthlyIncome,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expense',
                data: monthlyExpense,
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Income vs Expense',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Prepare category pie chart data
    const categoryLabels = Object.keys(stats.categoryStats);
    const categoryExpenses = categoryLabels.map((cat) => stats.categoryStats[cat].expense);

    const pieChartData = {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Expenses by Category',
                data: categoryExpenses,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Expenses by Category',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
            },
        },
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Overview of your financial status</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard
                            title="Total Income"
                            amount={stats.totalIncome}
                            icon="💰"
                            type="income"
                        />
                        <StatsCard
                            title="Total Expense"
                            amount={stats.totalExpense}
                            icon="💸"
                            type="expense"
                        />
                        <StatsCard
                            title="Balance"
                            amount={stats.balance}
                            icon="💵"
                            type="balance"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="card">
                            <div className="h-80">
                                <Bar data={barChartData} options={barChartOptions} />
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="card">
                            <div className="h-80">
                                <Pie data={pieChartData} options={pieChartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/transactions')}
                            className="btn btn-primary text-lg px-8 py-3"
                        >
                            View All Transactions
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
