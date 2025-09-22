import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface Citizen {
    id: number;
    full_name: string;
    nik: string;
    phone_number: string;
    profile_picture?: string;
    address: string;
    date_of_birth: string;
    occupation: string;
    position?: string;
    religion: string;
    marital_status: string;
    gender: string;
    status: string;
    family_id: number;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCitizens {
    data: Citizen[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface WelcomePageProps {
    citizens: PaginatedCitizens;
    filters: {
        search?: string;
    };
}

// Helper function to get initials from full name
const getInitials = (fullName: string): string => {
    return fullName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Helper function to format status
const formatStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        head_of_household: 'Kepala Keluarga',
        spouse: 'Istri/Suami',
        child: 'Anak',
        other: 'Lainnya',
    };
    return statusMap[status] || status;
};

// Helper function to format gender
const formatGender = (gender: string): string => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
};

// Helper function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Main App Component
const WelcomePage: React.FC<WelcomePageProps> = ({ citizens, filters }) => {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Handle search with debounce
    useEffect(() => {
        // Skip the initial render to avoid unnecessary request
        if (searchQuery === (filters.search || '')) return;

        const timeoutId = setTimeout(() => {
            router.get(
                '/',
                { search: searchQuery || undefined },
                {
                    preserveState: true,
                    replace: true,
                    only: ['citizens'],
                },
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle pagination
    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };
    return (
        <>
            <div className="min-h-screen bg-green-50">
                <Sidebar />

                {/* Main Content */}
                <div className="lg:ml-64">
                    <Header
                        title="Dashboard Desa"
                        icon="🌾"
                        onSettingsClick={() => {
                            // Handle settings click - you can add your logic here
                            console.log('Settings clicked from Dashboard Desa');
                        }}
                    />

                    {/* Page Content */}
                    <main className="bg-green-50 p-4 lg:p-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Page Header */}
                            <div className="mb-6">
                                <h1 className="font-heading text-2xl font-bold text-green-900">Data Penduduk</h1>
                                <p className="mt-2 text-green-700">
                                    Kelola data penduduk desa
                                    {searchQuery.trim() && (
                                        <span className="ml-2 text-sm">
                                            - Menampilkan {citizens.total} hasil dari pencarian "{searchQuery}"
                                        </span>
                                    )}
                                </p>
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
                                        placeholder="Cari penduduk (nama, NIK, pekerjaan)..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full rounded-lg border border-green-300 bg-white py-2 pr-4 pl-10 text-green-900 placeholder-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                    />
                                </div>
                                <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Penduduk
                                </button>
                            </div>

                            {/* Citizens Table */}
                            <div className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-green-200">
                                        <thead className="bg-green-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Nama Lengkap
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    NIK
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Pekerjaan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Status Keluarga
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                                    Jenis Kelamin
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-amber-800 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-100 bg-white">
                                            {citizens.data.length > 0 ? (
                                                citizens.data.map((citizen) => (
                                                    <tr key={citizen.id} className="hover:bg-green-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
                                                                        <span className="text-sm font-medium text-white">
                                                                            {getInitials(citizen.full_name)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-green-900">{citizen.full_name}</div>
                                                                    <div className="text-sm text-green-700">{citizen.occupation}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-green-900">{citizen.nik}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                                                                {citizen.occupation}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                                    citizen.status === 'head_of_household'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}
                                                            >
                                                                {formatStatus(citizen.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                                    citizen.gender === 'male'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-pink-100 text-pink-800'
                                                                }`}
                                                            >
                                                                {formatGender(citizen.gender)}
                                                            </span>
                                                        </td>
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
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-green-500">
                                                        {filters.search
                                                            ? `Tidak ada penduduk yang ditemukan untuk pencarian "${filters.search}"`
                                                            : 'Belum ada data penduduk yang tersedia.'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between rounded-lg border-t border-green-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <button
                                        onClick={() => citizens.prev_page_url && handlePageChange(citizens.prev_page_url)}
                                        disabled={!citizens.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => citizens.next_page_url && handlePageChange(citizens.next_page_url)}
                                        disabled={!citizens.next_page_url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-green-700">
                                            Showing <span className="font-medium">{citizens.from || 0}</span> to{' '}
                                            <span className="font-medium">{citizens.to || 0}</span> of{' '}
                                            <span className="font-medium">{citizens.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            {citizens.links.map((link, index) => {
                                                // Handle previous button
                                                if (index === 0) {
                                                    return (
                                                        <button
                                                            key="prev"
                                                            onClick={() => link.url && handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-green-400 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <span className="sr-only">Previous</span>
                                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    );
                                                }

                                                // Handle next button
                                                if (index === citizens.links.length - 1) {
                                                    return (
                                                        <button
                                                            key="next"
                                                            onClick={() => link.url && handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-green-400 ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <span className="sr-only">Next</span>
                                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    );
                                                }

                                                // Handle page numbers and ellipsis
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => link.url && handlePageChange(link.url)}
                                                        disabled={!link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-green-300 ring-inset hover:bg-green-50 focus:z-20 focus:outline-offset-0 ${
                                                            link.active ? 'bg-green-50 text-green-700' : 'text-green-600'
                                                        } ${!link.url ? 'cursor-default' : 'cursor-pointer'}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
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
