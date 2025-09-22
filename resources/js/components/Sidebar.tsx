import * as Collapsible from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, ChevronRight, Home, Menu, Settings, User, Users, X } from 'lucide-react';
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

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        href: '/dashboard',
    },
    {
        id: 'warga',
        label: 'Manajemen Warga',
        icon: <Users className="h-5 w-5" />,
        submenu: [
            { id: 'data-warga', label: 'Data Penduduk', href: '/warga' },
            { id: 'kartu-keluarga', label: 'Kartu Keluarga', href: '/warga/kk' },
            { id: 'surat-keterangan', label: 'Surat Keterangan', href: '/warga/surat' },
        ],
    },
    {
        id: 'settings',
        label: 'Pengaturan',
        icon: <Settings className="h-5 w-5" />,
        href: '/settings',
    },
];

const SidebarContent: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (menuId: string) => {
        setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
    };

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
            <nav className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => (
                    <div key={item.id}>
                        {item.submenu ? (
                            <Collapsible.Root open={openMenus.includes(item.id)} onOpenChange={() => toggleMenu(item.id)}>
                                <Collapsible.Trigger className="flex w-full items-center justify-between rounded-lg p-3 text-left text-green-800 transition-all duration-200 hover:bg-green-100 hover:text-green-900 hover:shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-green-700">{item.icon}</div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    {openMenus.includes(item.id) ? (
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
                                            className="block rounded-md px-3 py-2 text-sm text-green-700 transition-all duration-200 hover:bg-green-50 hover:text-green-900 hover:shadow-sm"
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
                                className="flex items-center space-x-3 rounded-lg p-3 text-green-800 transition-all duration-200 hover:bg-green-100 hover:text-green-900 hover:shadow-sm"
                            >
                                <div className="text-green-700">{item.icon}</div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </a>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-green-200 bg-green-100 p-4">
                <div className="flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-green-900">Kepala Desa</p>
                        <p className="truncate text-xs text-green-700">admin@desa.id</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-green-200 lg:bg-green-50 lg:shadow-lg ${className}`}
            >
                <SidebarContent />
            </div>

            {/* Mobile Menu Button */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="rounded-lg border border-green-300 bg-green-100 p-2 shadow-md transition-all duration-200 hover:bg-green-200 hover:shadow-lg"
                >
                    <Menu className="h-5 w-5 text-green-800" />
                </button>
            </div>

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

export default Sidebar;
