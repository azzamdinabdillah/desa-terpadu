import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { EventType } from '@/types/event/eventType';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Eye, MapPin, Pencil, Plus, Search, Settings, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface EventPageProps {
    events: {
        data: EventType[];
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
        status?: string;
        type?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function EventPage() {
    const { events, filters, flash } = usePage().props as unknown as EventPageProps;
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(
            '/events',
            {
                q: searchTerm,
                status: status === 'all' ? undefined : status,
                type: type === 'all' ? undefined : type,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.q || '') || (filters.status || 'all') !== status || (filters.type || 'all') !== type) {
                router.get(
                    '/events',
                    {
                        q: searchTerm,
                        status: status === 'all' ? undefined : status,
                        type: type === 'all' ? undefined : type,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, status, type, filters.q, filters.status, filters.type]);

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, { preserveState: true, replace: true });
        }
    };

    const columns = useMemo(
        () => [
            {
                key: 'event_name',
                header: 'Nama Event',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => (
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-900">{item.event_name}</span>
                    </div>
                ),
            },
            {
                key: 'flyer',
                header: 'Flyer',
                className: 'whitespace-nowrap',
                cell: (item: EventType) =>
                    item.flyer ? (
                        <img
                            src={`/storage/${item.flyer}`}
                            alt={item.event_name}
                            className="h-12 w-12 rounded border border-green-200 object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/48x48?text=No+Image';
                                target.alt = 'Flyer tidak tersedia';
                                target.className = 'h-12 w-12 rounded border border-green-100 object-cover opacity-60';
                            }}
                        />
                    ) : (
                        <img
                            src="https://placehold.co/48x48?text=No+Image"
                            alt="Tidak ada flyer"
                            className="h-12 w-12 rounded border border-green-100 object-cover opacity-60"
                        />
                    ),
            },
            {
                key: 'description',
                header: 'Deskripsi',
                className: 'max-w-xs', // Batasi lebar kolom
                cell: (item: EventType) => <span className="block max-w-xs truncate text-sm text-green-900">{item.description || '-'}</span>,
            },
            {
                key: 'date_start',
                header: 'Tanggal Mulai',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.date_start)}</span>
                    </div>
                ),
            },
            {
                key: 'date_end',
                header: 'Tanggal Selesai',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.date_end)}</span>
                    </div>
                ),
            },
            {
                key: 'location',
                header: 'Lokasi',
                cell: (item: EventType) => (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="max-w-xs truncate text-sm text-green-900">{item.location}</span>
                    </div>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => <StatusBadge type="status" value={item.status} />,
            },
            {
                key: 'type',
                header: 'Tipe',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => <StatusBadge type="eventType" value={item.type} />,
            },
            // Hanya tampilkan kolom peserta jika tipe event bukan 'public' (umum)
            {
                key: 'participants',
                header: 'Peserta',
                className: 'whitespace-nowrap',
                // Jika tipe event 'public', tampilkan strip saja
                cell: (item: EventType) =>
                    item.type === 'public' ? (
                        <span className="text-sm text-green-400 italic">-</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-900">
                                {item.participants?.length}
                                {item.max_participants && ` / ${item.max_participants}`}
                            </span>
                        </div>
                    ),
            },
            {
                key: 'createdBy',
                header: 'Dibuat Oleh',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => <span className="text-sm text-green-900">{item.created_by?.citizen.full_name}</span>,
            },
            {
                key: 'action',
                header: 'Aksi',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.visit(`/events/${item.id}`)} title="Lihat Detail">
                            <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                onClick={() => router.visit(`/events/${item.id}/edit`)}
                                title="Edit Event"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            onClick={() => router.visit(`/events/${item.id}/change-status`)}
                            title="Ubah Status"
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                        {item.type !== 'public' && item.status === 'pending' && !isAdmin && (
                            <Button
                                variant="ghost"
                                onClick={() => router.visit(`/events/${item.id}/register`)}
                                title="Daftar Event"
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                                <UserPlus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [isAdmin],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Data Event Desa" icon="🎉" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Event" description="Daftar seluruh event desa" search={filters?.q ?? ''} total={events.total} />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari event (nama, lokasi, deskripsi)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={status}
                                onChange={(val) => setStatus(val)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'pending', label: 'Menunggu' },
                                    { value: 'ongoing', label: 'Berlangsung' },
                                    { value: 'finished', label: 'Selesai' },
                                ]}
                                className="min-w-[160px]"
                                placeholder="Pilih status"
                            />

                            <Select
                                label=""
                                value={type}
                                onChange={(val) => setType(val)}
                                options={[
                                    { value: 'all', label: 'Semua Tipe' },
                                    { value: 'public', label: 'Umum' },
                                    { value: 'restricted', label: 'Terbatas' },
                                ]}
                                className="min-w-[160px]"
                                placeholder="Pilih tipe"
                            />

                            {isAdmin && (
                                <Button
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                    variant="primary"
                                    onClick={() => router.visit('/events/create')}
                                >
                                    Tambah Event
                                </Button>
                            )}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={events.data}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Calendar className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data event</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.q || (filters.status && filters.status !== 'all') || (filters.type && filters.type !== 'all')
                                        ? 'Tidak ada event yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada data event yang tercatat.'}
                                </p>
                            </div>
                        }
                    />

                    <Pagination
                        page={events.current_page}
                        perPage={events.per_page}
                        total={events.total}
                        lastPage={events.last_page}
                        prevUrl={events.prev_page_url}
                        nextUrl={events.next_page_url}
                        links={events.links}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default EventPage;
