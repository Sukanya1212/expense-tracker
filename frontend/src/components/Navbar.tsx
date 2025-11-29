import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">💰</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
                    </Link>

                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/transactions"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                Transactions
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center space-x-4 border-l pl-6">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
