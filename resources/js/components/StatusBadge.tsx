import { getStatusLabel } from '@/lib/utils';
import React from 'react';

interface StatusBadgeProps {
    status: string;
    type?: 'event-status' | 'event-type' | 'citizen-status';
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'citizen-status', className = '' }) => {
    const getStatusBadgeColor = (status: string, badgeType: string) => {
        if (badgeType === 'event-status') {
            switch (status) {
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'ongoing':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'finished':
                    return 'bg-green-100 text-green-800 border-green-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        }

        if (badgeType === 'event-type') {
            switch (status) {
                case 'public':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'restricted':
                    return 'bg-orange-100 text-orange-800 border-orange-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        }

        // Default to citizen status
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

    const getStatusText = (status: string, badgeType: string) => {
        if (badgeType === 'event-status') {
            switch (status) {
                case 'pending':
                    return 'Menunggu';
                case 'ongoing':
                    return 'Berlangsung';
                case 'finished':
                    return 'Selesai';
                default:
                    return status;
            }
        }

        if (badgeType === 'event-type') {
            switch (status) {
                case 'public':
                    return 'Umum';
                case 'restricted':
                    return 'Terbatas';
                default:
                    return status;
            }
        }

        // Default to citizen status
        return getStatusLabel(status);
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusBadgeColor(status, type)} ${className}`}
        >
            {getStatusText(status, type)}
        </span>
    );
};

export default StatusBadge;
