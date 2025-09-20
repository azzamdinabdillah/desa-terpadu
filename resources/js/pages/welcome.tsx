import * as Collapsible from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, ChevronRight, Home, Menu, Settings, User, Users, X } from 'lucide-react';
import React, { useState } from 'react';

/*
============================================
KOMBINASI WARNA ALTERNATIF PEDESAAN
============================================

KOMBINASI 1: Warm Earth (Coklat Hangat) - AKTIF
- Primary: Amber/Orange (coklat hangat)
- Neutral: Stone (abu-abu natural)
- Accent: Green (hijau alam)
- Background: Warm cream

KOMBINASI 2: Forest Green (Hijau Hutan)
- Primary: Green (hijau alam)
- Neutral: Slate (abu-abu modern)
- Accent: Blue (biru langit)
- Background: Light green

KOMBINASI 3: Sunset Orange (Orange Matahari Terbenam)
- Primary: Orange (orange hangat)
- Neutral: Warm gray
- Accent: Yellow (kuning emas)
- Background: Cream

KOMBINASI 4: Sage Garden (Sage Kebun)
- Primary: Sage green (hijau sage)
- Neutral: Warm beige
- Accent: Terracotta (merah bata)
- Background: Light sage

CARA MENGGANTI: Uncomment kombinasi yang diinginkan dan comment yang aktif
*/

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

// Main App Component
const WelcomePage: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-green-50">
                <Sidebar />

                {/* Main Content */}
                <div className="lg:ml-64">
                    <header className="border-b border-green-200 bg-gradient-to-r from-green-700 to-green-900 px-4 py-4 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="lg:hidden">
                                {/* Space for mobile menu button */}
                                <div className="w-10"></div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <span className="text-sm">🌾</span>
                                </div>
                                <h1 className="font-heading text-xl font-bold text-white">Dashboard Desa</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="rounded-lg bg-white/10 p-2 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md">
                                    <Settings className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="bg-green-50 p-4 lg:p-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Page Header */}
                            <div className="mb-6">
                                <h1 className="font-heading text-2xl font-bold text-green-900">Manajemen Pengguna</h1>
                                <p className="mt-2 text-green-700">Kelola data pengguna sistem manajemen desa</p>
                            </div>

                            {/* Search and Add Button */}
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative max-w-md flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari pengguna..."
                                        className="w-full rounded-lg border border-green-300 bg-white py-2 pr-4 pl-10 text-green-900 placeholder-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                    />
                                </div>
                                <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Pengguna
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-green-200">
                                        <thead className="bg-green-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Tanggal Dibuat
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-amber-800 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-100 bg-white">
                                            <tr className="hover:bg-green-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                                                                <span className="text-sm font-medium text-white">BD</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-green-900">Budi Santoso</div>
                                                            <div className="text-sm text-green-700">Kepala Desa</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-green-900">budi.santoso@desa.id</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Admin
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Aktif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-green-700">15 Jan 2024</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-green-600 hover:text-green-800">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="p-1 text-green-600 hover:text-red-600">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-green-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                                                                <span className="text-sm font-medium text-white">ST</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-green-900">Siti Nurhaliza</div>
                                                            <div className="text-sm text-green-700">Sekretaris Desa</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-green-900">siti.nurhaliza@desa.id</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Staff
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Aktif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-green-700">12 Feb 2024</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-green-600 hover:text-green-800">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="p-1 text-green-600 hover:text-red-600">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-green-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                                                                <span className="text-sm font-medium text-white">AG</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-green-900">Ahmad Gunawan</div>
                                                            <div className="text-sm text-green-700">Bendahara Desa</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-green-900">ahmad.gunawan@desa.id</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Finance
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-green-700">08 Mar 2024</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-green-600 hover:text-green-800">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="p-1 text-green-600 hover:text-red-600">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-green-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                                                                <span className="text-sm font-medium text-white">DP</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-green-900">Dewi Purnama</div>
                                                            <div className="text-sm text-green-700">Staff Pelayanan</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-green-900">dewi.purnama@desa.id</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                        Staff
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800">
                                                        Non-Aktif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-green-700">22 Jan 2024</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-green-600 hover:text-green-800">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="p-1 text-green-600 hover:text-red-600">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between rounded-lg border-t border-green-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <button className="relative inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
                                        Previous
                                    </button>
                                    <button className="relative ml-3 inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-green-700">
                                            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                                            <span className="font-medium">20</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-green-400 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0">
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button className="relative inline-flex items-center bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-300 ring-inset hover:bg-green-100 focus:z-20 focus:outline-offset-0">
                                                1
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-green-600 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0">
                                                2
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-green-600 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0">
                                                3
                                            </button>
                                            <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-green-400 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0">
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;

/*
============================================
DESAIN SISTEM MANAJEMEN DESA
============================================

KOMBINASI WARNA YANG TERSEDIA:

KOMBINASI 1: Warm Earth (Coklat Hangat) - AKTIF
- Primary: Amber/Orange (coklat hangat)
- Neutral: Stone (abu-abu natural)
- Accent: Green (hijau alam)
- Background: Warm amber cream
- Karakter: Hangat, tradisional, pedesaan klasik

KOMBINASI 2: Forest Green (Hijau Hutan)
- Primary: Green (hijau alam)
- Neutral: Slate (abu-abu modern)
- Accent: Blue (biru langit)
- Background: Light green
- Karakter: Segar, alam, hutan, natural

KOMBINASI 3: Sunset Orange (Orange Matahari Terbenam)
- Primary: Orange (orange hangat)
- Neutral: Warm gray
- Accent: Yellow (kuning emas)
- Background: Cream orange
- Karakter: Energik, hangat, matahari terbenam

KOMBINASI 4: Sage Garden (Sage Kebun)
- Primary: Sage green (hijau sage)
- Neutral: Warm beige
- Accent: Terracotta (merah bata)
- Background: Light sage
- Karakter: Tenang, herbal, kebun, natural

FONT:
- Poppins untuk semua elemen (sans-serif, friendly, modern)

CARA MENGGANTI KOMBINASI:
1. Uncomment kombinasi yang diinginkan
2. Comment kombinasi yang sedang aktif
3. Sesuaikan warna-warna di sidebar, header, dan elemen lainnya
*/
