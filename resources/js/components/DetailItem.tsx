import { LucideIcon } from 'lucide-react';
import React from 'react';

interface DetailItemProps {
    icon: LucideIcon;
    label: string;
    value: string | React.ReactNode;
    withBorder?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, withBorder = true }) => {
    return (
        <div className={`flex items-center gap-3 ${withBorder ? 'border-b border-gray-100 pb-3' : ''}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                <Icon className="h-4 w-4 text-green-700" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                {typeof value === 'string' ? <p className="text-sm font-semibold text-gray-900">{value}</p> : value}
            </div>
        </div>
    );
};

export default DetailItem;
