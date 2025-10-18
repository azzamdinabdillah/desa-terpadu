import { PageProps } from '@/types/index.d';
import { router, usePage } from '@inertiajs/react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ChevronDown, ChevronRight, Menu, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { menuItems } from './Sidebar';

interface HeaderProps {
    title?: string;
    icon?: string;
    showMobileMenuSpace?: boolean;
    className?: string;
    showBackButton?: boolean;
}

const SidebarContent: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const { url } = usePage();

    const toggleMenu = (menuId: string) => {
        setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
    };

    // Function to check if a menu item is active
    const isActive = (href: string) => {
        return url === href || url.startsWith(href + '/') || url.startsWith(href + '?');
    };

    // Function to check if a submenu item is active
    const isSubmenuActive = (href: string) => {
        return url === href || url.startsWith(href + '/') || url.startsWith(href + '?');
    };

    // Function to check if a parent menu should be open (has active submenu)
    const shouldMenuBeOpen = (submenu: { href: string }[]) => {
        return submenu.some((item) => isSubmenuActive(item.href));
    };

    const { props } = usePage<PageProps>();
    const isAuthenticated = !!props?.auth?.user;

    return (
        <div className="flex h-full flex-col bg-green-50">
            {/* Logo Section */}
            <div className="border-b border-green-200 bg-green-100 p-6">
                <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                        <span className="text-sm font-bold text-white">🏘️</span>
                    </div>
                    <div>
                        <h2 className="font-display text-lg font-bold text-green-900">Desa Terpadu</h2>
                        <p className="text-xs text-green-700">Sistem Manajemen Desa</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                {menuItems
                    .filter((item) => {
                        // Hide login menu when user is authenticated
                        if (item.id === 'login' && isAuthenticated) {
                            return false;
                        }
                        return true;
                    })
                    .map((item) => (
                        <div key={item.id}>
                            {item.submenu ? (
                                <Collapsible.Root
                                    open={openMenus.includes(item.id) || shouldMenuBeOpen(item.submenu)}
                                    onOpenChange={() => toggleMenu(item.id)}
                                >
                                    <Collapsible.Trigger
                                        className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-all duration-200 hover:bg-green-100 hover:text-green-900 hover:shadow-sm ${
                                            shouldMenuBeOpen(item.submenu) ? 'bg-green-200 text-green-900 shadow-sm' : 'text-green-800'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`${shouldMenuBeOpen(item.submenu) ? 'text-green-800' : 'text-green-700'}`}>
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        {openMenus.includes(item.id) || shouldMenuBeOpen(item.submenu) ? (
                                            <ChevronDown className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-green-600" />
                                        )}
                                    </Collapsible.Trigger>

                                    <Collapsible.Content className="mt-2 ml-4 space-y-1">
                                        {item.submenu.map((subitem) => (
                                            <a
                                                key={subitem.id}
                                                href={subitem.href}
                                                onClick={onItemClick}
                                                className={`block rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-green-50 hover:text-green-900 hover:shadow-sm ${
                                                    isSubmenuActive(subitem.href)
                                                        ? 'bg-green-200 font-semibold text-green-900 shadow-sm'
                                                        : 'text-green-700'
                                                }`}
                                            >
                                                {subitem.label}
                                            </a>
                                        ))}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            ) : (
                                <a
                                    href={item.href}
                                    onClick={onItemClick}
                                    className={`flex items-center space-x-3 rounded-lg p-3 transition-all duration-200 hover:bg-green-100 hover:text-green-900 hover:shadow-sm ${
                                        isActive(item.href || '') ? 'bg-green-200 text-green-900 shadow-sm' : 'text-green-800'
                                    }`}
                                >
                                    <div className={`${isActive(item.href || '') ? 'text-green-800' : 'text-green-700'}`}>{item.icon}</div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </a>
                            )}
                        </div>
                    ))}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-green-200 bg-green-100 p-4">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-px">
                            <p className="truncate text-sm font-semibold text-green-900">{props?.auth?.user?.citizen?.full_name ?? 'Tamu'}</p>
                            <div>
                                <p className="truncate text-xs text-green-700">{props?.auth?.user?.email ?? 'Belum masuk'}</p>
                                {props?.auth?.user?.role && (
                                    <p className="truncate text-xs text-green-500 capitalize">
                                        {props.auth.user.role === 'admin'
                                            ? 'Admin'
                                            : props.auth.user.role === 'citizen'
                                              ? 'Warga'
                                              : props.auth.user.role}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {isAuthenticated && (
                        <button
                            type="button"
                            onClick={() => router.post(`${import.meta.env.VITE_APP_SUB_URL}/logout`)}
                            className="mt-3 w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                            Keluar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({
    title = 'Dashboard Desa',
    icon = '🌾',
    // showMobileMenuSpace = true,
    className = '',
    showBackButton = false,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className={`border-b border-green-200 bg-gradient-to-r from-green-700 to-green-900 px-4 py-4 lg:px-8 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {showBackButton && (
                            <button
                                onClick={() => window.history.back()}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all duration-200 hover:bg-white/30 hover:shadow-md"
                                aria-label="Kembali"
                            >
                                <ArrowLeft className="h-4 w-4 text-white" />
                            </button>
                        )}
                        <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/20 md:flex">
                            <span className="text-sm">{icon}</span>
                        </div>
                        <h1 className="font-heading text-base font-bold text-white md:text-xl">{title}</h1>
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-lg border border-white/20 bg-white/10 p-2 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
                    <Dialog.Content className="fixed top-0 left-0 z-50 h-full w-80 bg-green-50 lg:hidden">
                        {/* Close Button */}
                        <div className="absolute top-4 right-4">
                            <Dialog.Close className="rounded-lg p-2 transition-all duration-200 hover:bg-green-200">
                                <X className="h-5 w-5 text-green-800" />
                            </Dialog.Close>
                        </div>

                        <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default Header;
