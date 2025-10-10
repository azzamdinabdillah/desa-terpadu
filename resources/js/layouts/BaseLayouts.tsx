import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export function BaseLayouts({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Load initial state from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved === 'true';
        }
        return false;
    });

    useEffect(() => {
        // Save state to localStorage whenever it changes
        localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }, [isCollapsed]);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen bg-green-50">
            <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[270px]'}`}>{children}</div>
        </div>
    );
}
