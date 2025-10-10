import Alert, { AlertProps } from '@/components/Alert';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { User } from '@/types/user/userTypes';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Mail, Search, Shield, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface UserPageProps {
    users: {
        data: User[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        q?: string;
        role?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface ExtendedUser extends User {
    created_at?: string;
    updated_at?: string;
}

function UserPage() {
    const { users, filters, flash } = usePage().props as unknown as UserPageProps;
    const { isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Redirect if not admin
    useEffect(() => {
        if (!isAdmin) {
            router.visit('/');
        }
    }, [isAdmin]);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.q || '') || (filters.role || 'all') !== role || (filters.status || 'all') !== status) {
                router.get(
                    '/users',
                    {
                        q: searchTerm,
                        role: role === 'all' ? undefined : role,
                        status: status === 'all' ? undefined : status,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, role, status, filters.q, filters.role, filters.status]);

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, { preserveState: true, replace: true });
        }
    };

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'superadmin':
                return 'Super Admin';
            case 'citizen':
                return 'Warga';
            default:
                return '-';
        }
    };

    const getRoleBadgeColor = (role?: string) => {
        switch (role) {
            case 'admin':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'superadmin':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'citizen':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'active':
                return 'Aktif';
            case 'inactive':
                return 'Tidak Aktif';
            default:
                return '-';
        }
    };

    const getStatusBadgeColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const columns = useMemo(
        () => [
            {
                key: 'citizen',
                header: 'Nama Pengguna',
                className: 'whitespace-nowrap',
                cell: (item: ExtendedUser) => (
                    <div className="flex items-center gap-2">
                        <Users className="h-8 w-8 rounded-full border border-green-200 bg-green-50 p-1.5 text-green-600" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-900">{item.citizen?.full_name || 'N/A'}</span>
                            {item.citizen?.nik && <span className="text-xs text-green-600">NIK: {item.citizen.nik}</span>}
                        </div>
                    </div>
                ),
            },
            {
                key: 'email',
                header: 'Email',
                className: 'whitespace-nowrap',
                cell: (item: ExtendedUser) => (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.email}</span>
                    </div>
                ),
            },
            {
                key: 'role',
                header: 'Role',
                className: 'whitespace-nowrap',
                cell: (item: ExtendedUser) => (
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(item.role)}`}>
                            {getRoleLabel(item.role)}
                        </span>
                    </div>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (item: ExtendedUser) => (
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                    </span>
                ),
            },
            {
                key: 'created_at',
                header: 'Tanggal Daftar',
                className: 'whitespace-nowrap',
                cell: (item: ExtendedUser) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.created_at ? formatDate(item.created_at) : '-'}</span>
                    </div>
                ),
            },
        ],
        [],
    );

    if (!isAdmin) {
        return null;
    }

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Pengguna" icon="👥" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Daftar Pengguna"
                        description="Kelola semua pengguna yang terdaftar dalam sistem"
                        search={filters?.q ?? ''}
                        total={users.total}
                    />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari pengguna (nama, email, NIK)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={role}
                                onChange={(val) => setRole(val)}
                                options={[
                                    { value: 'all', label: 'Semua Role' },
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'superadmin', label: 'Super Admin' },
                                    { value: 'citizen', label: 'Warga' },
                                ]}
                                className="min-w-[180px]"
                                placeholder="Pilih role"
                            />

                            <Select
                                label=""
                                value={status}
                                onChange={(val) => setStatus(val)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'active', label: 'Aktif' },
                                    { value: 'inactive', label: 'Tidak Aktif' },
                                ]}
                                className="min-w-[180px]"
                                placeholder="Pilih status"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={users.data as ExtendedUser[]}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <UserIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data pengguna</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.q || (filters.role && filters.role !== 'all') || (filters.status && filters.status !== 'all')
                                        ? 'Tidak ada pengguna yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada pengguna yang terdaftar.'}
                                </p>
                            </div>
                        }
                    />

                    <Pagination
                        page={users.current_page}
                        perPage={users.per_page}
                        total={users.total}
                        lastPage={users.last_page}
                        prevUrl={users.prev_page_url}
                        nextUrl={users.next_page_url}
                        links={users.links}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default UserPage;
