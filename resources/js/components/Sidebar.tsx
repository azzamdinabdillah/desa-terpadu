import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Bell, Building, Calendar, ChevronDown, ChevronRight, CircleDollarSign, FileText, HandHeart, Home, LogIn, User, Users } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    className?: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    submenu?: {
        id: string;
        label: string;
        href: string;
    }[];
}

export const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        href: '/dashboard',
    },
    {
        id: 'finance',
        label: 'Manajemen Keuangan',
        icon: <CircleDollarSign className="h-5 w-5" />,
        href: '/finance',
    },
    {
        id: 'warga',
        label: 'Manajemen Warga',
        icon: <Users className="h-5 w-5" />,
        submenu: [
            { id: 'data-warga', label: 'Data Penduduk', href: '/citizens' },
            { id: 'data-keluarga', label: 'Keluarga', href: '/families' },
        ],
    },
    {
        id: 'announcement',
        label: 'Pengumuman',
        icon: <Bell className="h-5 w-5" />,
        href: '/announcement',
    },
    {
        id: 'event',
        label: 'Acara',
        icon: <Calendar className="h-5 w-5" />,
        href: '/events',
    },
    {
        id: 'social-aid',
        label: 'Bantuan Sosial',
        icon: <HandHeart className="h-5 w-5" />,
        submenu: [
            { id: 'social-aid-programs', label: 'Program Bantuan', href: '/social-aid' },
            { id: 'social-recipients', label: 'Penerima Bantuan', href: '/recipients' },
        ],
    },
    {
        id: 'asset',
        label: 'Aset',
        icon: <Building className="h-5 w-5" />,
        submenu: [
            { id: 'asset', label: 'Data Aset', href: '/assets' },
            { id: 'asset-loan', label: 'Peminjaman Aset', href: '/asset-loans' },
        ],
    },
    {
        id: 'master-documents',
        label: 'Master Dokumen',
        icon: <FileText className="h-5 w-5" />,
        submenu: [
            { id: 'master-documents-list', label: 'Daftar Dokumen', href: '/documents' },
            { id: 'applicant', label: 'Pengajuan Dokumen', href: '/document-applications' },
        ],
    },
    {
        id: 'profile',
        label: 'Profile',
        icon: <User className="h-5 w-5" />,
        href: '/profile',
    },
    {
        id: 'login',
        label: 'Login',
        icon: <LogIn className="h-5 w-5" />,
        href: '/login',
    },
];

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const { url } = usePage();

    const toggleMenu = (menuId: string) => {
        setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
    };

    // Function to check if a menu item is active
    // Now also matches if url starts with href + '?' (for query params)
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
        <div
            className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[270px] lg:flex-col lg:border-r lg:border-green-200 lg:bg-green-50 lg:shadow-lg ${className}`}
        >
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
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
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
                            onClick={() => router.post('/logout')}
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

export default Sidebar;
