import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Eye, MapPin, Search, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface EventType {
    id: number;
    event_name: string;
    description: string | null;
    date_start: string;
    date_end: string;
    location: string;
    flyer: string | null;
    status: 'pending' | 'ongoing' | 'finished';
    type: 'public' | 'restricted';
    max_participants: number | null;
    created_by: CitizenType;
    // createdBy: CitizenType;
    participants: Array<{
        id: number;
        citizen_id: number;
        citizen: {
            id: number;
            full_name: string;
        };
    }>;
    documentations: Array<{
        id: number;
        caption: string | null;
        path: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface EventPageProps {
    events: EventType[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function EventPage() {
    const { events, flash } = usePage().props as unknown as EventPageProps;
    const [searchTerm, setSearchTerm] = useState('');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [filteredEvents, setFilteredEvents] = useState<EventType[]>(events);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        const filtered = events.filter(
            (event) =>
                event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
        );
        setFilteredEvents(filtered);
    }, [searchTerm, events]);

    useEffect(() => {
        console.log(filteredEvents[0].created_by);
    }, [filteredEvents]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
            ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-800' },
            finished: { label: 'Selesai', className: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>;
    };

    const getTypeBadge = (type: string) => {
        const typeConfig = {
            public: { label: 'Umum', className: 'bg-blue-100 text-blue-800' },
            restricted: { label: 'Terbatas', className: 'bg-red-100 text-red-800' },
        };

        const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.public;

        return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>;
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
                cell: (item: EventType) => getStatusBadge(item.status),
            },
            {
                key: 'type',
                header: 'Tipe',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => getTypeBadge(item.type),
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
                                {item.participants.length}
                                {item.max_participants && ` / ${item.max_participants}`}
                            </span>
                        </div>
                    ),
            },
            {
                key: 'createdBy',
                header: 'Dibuat Oleh',
                className: 'whitespace-nowrap',
                cell: (item: EventType) => <span className="text-sm text-green-900">{item.created_by.full_name}</span>,
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
                        {item.type !== 'public' && (
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
        [],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Data Event Desa" icon="🎉" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Event" description="Daftar seluruh event desa" search={searchTerm} total={filteredEvents.length} />

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
                                inputClassName="pl-10"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredEvents}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Calendar className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data event</h3>
                                <p className="mb-6 text-green-700">
                                    {searchTerm ? 'Tidak ada event yang sesuai dengan pencarian Anda.' : 'Belum ada data event yang tercatat.'}
                                </p>
                            </div>
                        }
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default EventPage;
