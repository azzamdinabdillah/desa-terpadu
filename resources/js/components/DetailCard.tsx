import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

interface DetailCardProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, icon: Icon, children }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
            <div className="border-b border-green-200 bg-green-100 px-6 py-4">
                <div className="flex items-center">
                    <Icon className="mr-2 h-5 w-5 text-green-800" />
                    <h3 className="text-lg font-bold text-green-800">{title}</h3>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
};

export default DetailCard;
