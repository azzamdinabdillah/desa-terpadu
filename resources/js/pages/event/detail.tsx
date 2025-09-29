import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDateTime } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { EventType, EventsDocumentationType } from '@/types/event/eventType';
import { Head, Link, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Clock, MapPin, Settings, User, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EventDetailProps {
    event: EventType & {
        createdBy: CitizenType;
        participants: Array<{
            id: number;
            citizen: CitizenType;
            created_at: string;
        }>;
        documentations: EventsDocumentationType[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
    const { flash } = usePage().props as unknown as EventDetailProps;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [selectedDocumentation, setSelectedDocumentation] = useState<EventsDocumentationType | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    return (
        <BaseLayouts>
            <Head title={`Detail Event - ${event.event_name}`} />
            <div>
                <Header title="Detail Event" icon="🎉" showBackButton={true} />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title={event.event_name} description="Detail lengkap event desa" />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Event Header */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <div className="mb-4 flex items-center space-x-4">
                                            <StatusBadge type="status" value={event.status} />
                                            <StatusBadge type="eventType" value={event.type} />
                                        </div>
                                    </div>
                                    {event.flyer ? (
                                        <div className="h-32 w-32 overflow-hidden rounded-lg border border-green-200">
                                            <img
                                                src={`/storage/${event.flyer}`}
                                                alt={event.event_name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://placehold.co/48x48?text=No+Image';
                                                    target.alt = 'Flyer tidak tersedia';
                                                    target.className = 'h-full w-full object-cover opacity-60';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-32 w-32 overflow-hidden rounded-lg border border-green-200">
                                            <img
                                                src="https://placehold.co/48x48?text=No+Image"
                                                alt="Flyer tidak tersedia"
                                                className="h-full w-full object-cover opacity-60"
                                            />
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-lg font-semibold text-green-900">Deskripsi</h3>
                                        <p className="leading-relaxed text-green-700">{event.description}</p>
                                    </div>
                                )}

                                {/* Event Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Tanggal Mulai</h4>
                                            <p className="text-green-700">{formatDateTime(event.date_start)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <Clock className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Tanggal Selesai</h4>
                                            <p className="text-green-700">{formatDateTime(event.date_end)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <MapPin className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Lokasi</h4>
                                            <p className="text-green-700">{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Dibuat Oleh</h4>
                                            <p className="text-green-700">{event.createdBy?.full_name || 'Tidak diketahui'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Participants Section - Only show for restricted events */}
                            {event.type === 'restricted' && (
                                <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-green-900">Peserta Event</h3>
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            {event.participants.length} peserta
                                            {event.max_participants && ` / ${event.max_participants} maksimal`}
                                        </span>
                                    </div>

                                    {event.participants.length > 0 ? (
                                        <div className="space-y-3">
                                            {event.participants.map((participant) => (
                                                <div
                                                    key={participant.id}
                                                    className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                            <span className="text-sm font-semibold text-green-600">
                                                                {participant.citizen.full_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-green-900">{participant.citizen.full_name}</h4>
                                                            <p className="text-sm text-green-600">NIK: {participant.citizen.nik}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-green-500">
                                                        Daftar: {new Date(participant.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                                <Users className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold text-green-900">Belum ada peserta</h3>
                                            <p className="text-green-700">Belum ada peserta yang mendaftar untuk event ini.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Documentation Section */}
                            {event.documentations.length > 0 && (
                                <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-xl font-semibold text-green-900">Dokumentasi Event</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {event.documentations.map((doc) => (
                                            <div key={doc.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
                                                {doc.path && (
                                                    <div className="mb-3">
                                                        <img
                                                            src={`/storage/${doc.path}`}
                                                            alt={doc.caption || 'Dokumentasi'}
                                                            className="h-32 w-full cursor-pointer rounded object-cover transition-transform hover:scale-105"
                                                            onClick={() => setSelectedDocumentation(doc)}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://placehold.co/48x48?text=No+Image';
                                                                target.alt = 'Dokumentasi tidak tersedia';
                                                                target.className =
                                                                    'h-32 w-full cursor-pointer rounded object-cover transition-transform hover:scale-105 opacity-60';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <h4 className="mb-1 font-medium text-green-900">{doc.caption}</h4>
                                                <p className="text-xs text-green-500">{new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Event Info Card */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-green-900">Informasi Event</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-green-500">Status</span>
                                        <div className="mt-1">
                                            <StatusBadge type="status" value={event.status} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-green-500">Tipe</span>
                                        <div className="mt-1">
                                            <StatusBadge type="eventType" value={event.type} />
                                        </div>
                                    </div>
                                    {event.type === 'restricted' && (
                                        <>
                                            <div>
                                                <span className="text-sm font-medium text-green-500">Jumlah Peserta</span>
                                                <p className="text-lg font-semibold text-green-900">{event.participants.length}</p>
                                            </div>
                                            {event.max_participants && (
                                                <div>
                                                    <span className="text-sm font-medium text-green-500">Maksimal Peserta</span>
                                                    <p className="text-lg font-semibold text-green-900">{event.max_participants}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div>
                                        <span className="text-sm font-medium text-green-500">Dibuat</span>
                                        <p className="text-sm text-green-900">{formatDateTime(event.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions - Only show for restricted events */}
                            {event.type === 'restricted' && (
                                <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-lg font-semibold text-green-900">Aksi Cepat</h3>
                                    <div className="space-y-3">
                                        <Link href={`/events/${event.id}/register`}>
                                            <Button className="w-full">Daftar Event</Button>
                                        </Link>
                                        <Link href="/events">
                                            <Button variant="outline" className="w-full">
                                                Kembali ke Daftar Event
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Back to Events - Always show */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-green-900">Navigasi</h3>
                                <div className="flex flex-col gap-2">
                                    <Link href={`/events/${event.id}/change-status`}>
                                        <Button className="w-full" icon={<Settings className="mr-2 h-4 w-4" />} iconPosition="left">
                                            Ubah Status Event
                                        </Button>
                                    </Link>
                                    <Link href="/events">
                                        <Button variant="outline" className="w-full">
                                            Kembali ke Daftar Event
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                <Dialog.Root open={!!selectedDocumentation} onOpenChange={() => setSelectedDocumentation(null)}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                            <div className="flex items-center justify-between border-b border-green-200 p-4">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Detail Dokumentasi</Dialog.Title>
                                <Dialog.Close asChild>
                                    <button className="rounded-lg p-2 text-green-700 hover:bg-green-50">
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Close>
                            </div>

                            <div className="p-4">
                                {selectedDocumentation && (
                                    <div className="space-y-4">
                                        <div className="max-h-[60vh] overflow-hidden">
                                            <img
                                                src={`/storage/${selectedDocumentation.path}`}
                                                alt={selectedDocumentation.caption || 'Dokumentasi'}
                                                className="h-full w-full rounded-lg border border-green-200 object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://placehold.co/48x48?text=No+Image';
                                                    target.alt = 'Dokumentasi tidak tersedia';
                                                    target.className = 'h-full w-full rounded-lg border border-green-200 object-contain opacity-60';
                                                }}
                                            />
                                        </div>

                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <h4 className="mb-2 text-lg font-semibold text-green-900">
                                                {selectedDocumentation.caption || 'Dokumentasi Event'}
                                            </h4>
                                            <p className="text-sm text-green-700">
                                                <span className="font-medium">Ditambahkan pada:</span>{' '}
                                                {new Date(selectedDocumentation.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </BaseLayouts>
    );
};

export default EventDetail;
