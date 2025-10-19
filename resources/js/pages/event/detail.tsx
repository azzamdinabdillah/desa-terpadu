import Alert, { AlertProps } from '@/components/Alert';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDateTime } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { EventType, EventsDocumentationType } from '@/types/event/eventType';
import { Head, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Clock, FileText, Image, MapPin, User, Users, X } from 'lucide-react';
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
    const { isAdmin } = useAuth();

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
                    <HeaderPage title="Detail Event" description="Detail lengkap event desa" />

                    <div className="space-y-6">
                        {/* Event Overview Card */}
                        <DetailCard title="Profil Event" icon={Calendar}>
                            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                                <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 border-green-200 bg-green-50 shadow-sm md:mb-0">
                                    {event.flyer ? (
                                        <img
                                            src={`${import.meta.env.VITE_APP_URL}/storage/${event.flyer}`}
                                            alt={event.event_name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://placehold.co/48x48?text=No+Image';
                                                target.alt = 'Flyer tidak tersedia';
                                                target.className = 'h-full w-full object-cover opacity-60';
                                            }}
                                        />
                                    ) : (
                                        <Calendar className="h-16 w-16 text-green-600" />
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="mb-2 text-2xl font-bold text-green-900">{event.event_name}</h2>
                                    <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                                        <StatusBadge type="status" value={event.status} />
                                        <StatusBadge type="eventType" value={event.type} />
                                    </div>
                                    {event.type === 'restricted' && (
                                        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                                            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                                                <Users className="h-4 w-4 text-green-600" />
                                                <span className="font-medium text-gray-700">
                                                    {event.participants.length}
                                                    {event.max_participants && ` / ${event.max_participants}`} peserta
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DetailCard>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Event Information */}
                            <DetailCard title="Informasi Event" icon={FileText}>
                                <div className="space-y-3">
                                    <DetailItem icon={Calendar} label="Tanggal Mulai" value={formatDateTime(event.date_start)} />
                                    <DetailItem icon={Clock} label="Tanggal Selesai" value={formatDateTime(event.date_end)} />
                                    <DetailItem icon={MapPin} label="Lokasi" value={event.location} />
                                    <DetailItem
                                        icon={User}
                                        label="Dibuat Oleh"
                                        value={event.created_by?.citizen.full_name || 'Tidak diketahui'}
                                        withBorder={false}
                                    />
                                </div>
                            </DetailCard>

                            {/* Description */}
                            {event.description && (
                                <DetailCard title="Deskripsi Event" icon={FileText}>
                                    <p className="leading-relaxed text-gray-900">{event.description}</p>
                                </DetailCard>
                            )}
                        </div>

                        {/* Participants Section - Only show for restricted events */}
                        {event.type === 'restricted' && (
                            <DetailCard title="Peserta Event" icon={Users}>
                                {event.participants.length > 0 ? (
                                    <div className="space-y-3">
                                        {event.participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="flex flex-col justify-between gap-3 rounded-lg border border-gray-100 bg-green-50 p-4 md:flex-row md:items-center"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                        <span className="text-sm font-semibold text-green-600">
                                                            {participant.citizen.full_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-green-900">{participant.citizen.full_name}</h4>
                                                        {isAdmin && <p className="text-sm text-gray-600">NIK: {participant.citizen.nik}</p>}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
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
                                        <p className="text-gray-700">Belum ada peserta yang mendaftar untuk event ini.</p>
                                    </div>
                                )}
                            </DetailCard>
                        )}

                        {/* Documentation Section */}
                        {event.documentations.length > 0 && (
                            <DetailCard title="Dokumentasi Event" icon={Image}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {event.documentations.map((doc) => (
                                        <div key={doc.id} className="rounded-lg border border-gray-200 bg-green-50 p-4">
                                            {doc.path && (
                                                <div className="mb-3">
                                                    <img
                                                        src={`${import.meta.env.VITE_APP_URL}/storage/${doc.path}`}
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
                                            <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>
                            </DetailCard>
                        )}
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
                                                src={`${import.meta.env.VITE_APP_URL}/storage/${selectedDocumentation.path}`}
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
