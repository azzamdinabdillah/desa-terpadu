import { Settings } from 'lucide-react';
import React from 'react';

interface HeaderProps {
    title?: string;
    icon?: string;
    onSettingsClick?: () => void;
    showMobileMenuSpace?: boolean;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard Desa', icon = '🌾', onSettingsClick, showMobileMenuSpace = true, className = '' }) => {
    const handleSettingsClick = () => {
        if (onSettingsClick) {
            onSettingsClick();
        } else {
            // Default behavior - could be a console log or nothing
            console.log('Settings clicked');
        }
    };

    return (
        <header className={`border-b border-green-200 bg-gradient-to-r from-green-700 to-green-900 px-4 py-4 lg:px-8 ${className}`}>
            <div className="flex items-center justify-between">
                {showMobileMenuSpace && (
                    <div className="lg:hidden">
                        {/* Space for mobile menu button */}
                        <div className="w-10"></div>
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <span className="text-sm">{icon}</span>
                    </div>
                    <h1 className="font-heading text-xl font-bold text-white">{title}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleSettingsClick}
                        className="rounded-lg bg-white/10 p-2 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md"
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
