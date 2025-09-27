import { getStatusLabel } from '@/lib/utils';
import React from 'react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'head_of_household':
                return 'bg-blue-100 text-blue-800';
            case 'spouse':
                return 'bg-green-100 text-green-800';
            case 'child':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(status)} ${className}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default StatusBadge;
