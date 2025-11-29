import React from 'react';

interface StatsCardProps {
    title: string;
    amount: number;
    icon: string;
    type: 'income' | 'expense' | 'balance';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, amount, icon, type }) => {
    const getColorClasses = () => {
        switch (type) {
            case 'income':
                return 'from-success-500 to-success-600 text-success-700';
            case 'expense':
                return 'from-danger-500 to-danger-600 text-danger-700';
            case 'balance':
                return 'from-primary-500 to-primary-600 text-primary-700';
            default:
                return 'from-gray-500 to-gray-600 text-gray-700';
        }
    };

    const formatAmount = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="card animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${getColorClasses().split(' ')[2]}`}>
                        {formatAmount(amount)}
                    </p>
                </div>
                <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${getColorClasses()
                        .split(' ')
                        .slice(0, 2)
                        .join(' ')} flex items-center justify-center text-3xl shadow-lg`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
