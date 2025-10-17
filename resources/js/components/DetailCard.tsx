import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

interface DetailCardProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    headerRight?: ReactNode;
    classNameContent?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, icon: Icon, children, headerRight, classNameContent }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
            <div className="border-b border-green-200 bg-green-100 px-6 py-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-800" />
                        <h3 className="text-base md:text-lg font-bold text-green-800">{title}</h3>
                    </div>
                    {headerRight && <div>{headerRight}</div>}
                </div>
            </div>
            <div className={`p-6 ${classNameContent}`}>{children}</div>
        </div>
    );
};

export default DetailCard;
