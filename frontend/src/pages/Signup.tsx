import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { signup, clearError } from '../store/slices/authSlice';

const signupSchema = yup.object().shape({
    name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const Signup: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        try {
            await signupSchema.validate(formData, { abortEarly: false });
            const { confirmPassword, ...signupData } = formData;
            dispatch(signup(signupData));
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                err.inner.forEach((error) => {
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });
                setValidationErrors(errors);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-success-50 via-white to-primary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-block w-16 h-16 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white font-bold text-3xl">💰</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Start tracking your expenses today</p>
                </div>

                {/* Signup Form */}
                <div className="card animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Server Error */}
                        {error && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`input ${validationErrors.name ? 'border-danger-500' : ''}`}
                            />
                            {validationErrors.name && (
                                <p className="text-danger-600 text-sm mt-1">{validationErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={`input ${validationErrors.email ? 'border-danger-500' : ''}`}
                            />
                            {validationErrors.email && (
                                <p className="text-danger-600 text-sm mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`input ${validationErrors.password ? 'border-danger-500' : ''}`}
                            />
                            {validationErrors.password && (
                                <p className="text-danger-600 text-sm mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`input ${validationErrors.confirmPassword ? 'border-danger-500' : ''}`}
                            />
                            {validationErrors.confirmPassword && (
                                <p className="text-danger-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-success w-full text-lg py-3"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
