import React from 'react';
import { TransactionCategory } from '../types';

interface FilterBarProps {
    category: string;
    startDate: string;
    endDate: string;
    search: string;
    onCategoryChange: (category: string) => void;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onSearchChange: (search: string) => void;
    onClearFilters: () => void;
}

const categories: (TransactionCategory | 'all')[] = [
    'all',
    'Food',
    'Travel',
    'Rent',
    'Shopping',
    'Salary',
    'Other',
];

const FilterBar: React.FC<FilterBarProps> = ({
    category,
    startDate,
    endDate,
    search,
    onCategoryChange,
    onStartDateChange,
    onEndDateChange,
    onSearchChange,
    onClearFilters,
}) => {
    return (
        <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="input"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label className="label">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="input"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="label">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className="input"
                    />
                </div>

                {/* Search */}
                <div>
                    <label className="label">Search Notes</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search in notes..."
                        className="input"
                    />
                </div>

                {/* Clear Button */}
                <div className="flex items-end">
                    <button onClick={onClearFilters} className="btn btn-secondary w-full">
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
