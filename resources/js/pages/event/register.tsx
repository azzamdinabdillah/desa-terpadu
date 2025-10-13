import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDateTime } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { EventType } from '@/types/event/eventType';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Info, MapPin, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventRegisterPageProps {
    event: EventType;
    userCitizen: CitizenType;
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: {
        error?: string;
    };
    [key: string]: unknown;
}

function EventRegisterPage() {
    const { event, userCitizen, flash, errors } = usePage().props as unknown as EventRegisterPageProps;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        } else if (errors?.error) {
            setAlert({ type: 'error', message: errors.error });
        }
    }, [flash, errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        router.post(
            `/events/${event.id}/register`,
            {},
            {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Pendaftaran berhasil!' });
                },
                onError: (errors) => {
                    setAlert({ type: 'error', message: Object.values(errors).join(', ') });
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen">
                <Header showBackButton title="Pendaftaran Event" icon="📝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Pendaftaran Event" description="Pendaftaran Event" />

                    {/* Event Information Card */}
                    <div className="mb-8">
                        <DetailCard title="Informasi Event" icon={Info}>
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center space-x-4">
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <DetailItem icon={Calendar} label="Tanggal Mulai" value={formatDateTime(event.date_start)} />
                                <DetailItem icon={Clock} label="Tanggal Selesai" value={formatDateTime(event.date_end)} />
                                <DetailItem icon={MapPin} label="Lokasi" value={event.location} withBorder={false} />
                                <DetailItem
                                    icon={User}
                                    label="Dibuat Oleh"
                                    value={event.created_by?.citizen.full_name || 'Tidak diketahui'}
                                    withBorder={false}
                                />
                            </div>
                        </DetailCard>
                    </div>

                    {/* Registration Form */}
                    <DetailCard title="Form Pendaftaran" icon={UserPlus}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <InputField
                                    label="Nama Lengkap"
                                    id="full_name"
                                    type="text"
                                    value={userCitizen?.full_name || ''}
                                    onChange={() => {}}
                                    readOnly
                                    helperText="Data diambil dari akun yang sedang login"
                                />
                                <InputField
                                    label="Nomor Induk Kependudukan (NIK)"
                                    id="nik"
                                    type="text"
                                    value={userCitizen?.nik || ''}
                                    onChange={() => {}}
                                    readOnly
                                    helperText="Data diambil dari akun yang sedang login"
                                />
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                <Button type="button" variant="outline" onClick={() => router.visit('/events')} className="w-full sm:w-auto">
                                    Kembali ke Daftar Event
                                </Button>

                                <Button type="submit" disabled={isLoading || !userCitizen}>
                                    {isLoading ? 'Mendaftar...' : 'Daftar Event'}
                                </Button>
                            </div>
                        </form>

                        {/* Status Event Warning */}
                        {event.status === 'finished' && (
                            <div className="mt-6 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Event Sudah Selesai</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>Event ini sudah selesai dan tidak dapat menerima pendaftaran baru.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {event.status === 'pending' && (
                            <div className="mt-6 rounded-md bg-yellow-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Event Belum Dimulai</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>Event ini belum dimulai. Pendaftaran tetap dibuka.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {event.status === 'ongoing' && (
                            <div className="mt-6 rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">Event Sedang Berlangsung</h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>Event ini sedang berlangsung. Pendaftaran tetap dibuka.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DetailCard>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default EventRegisterPage;
