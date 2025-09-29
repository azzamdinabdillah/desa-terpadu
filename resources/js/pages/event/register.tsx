import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDateTime } from '@/lib/utils';
import { EventType } from '@/types/event/eventType';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventRegisterPageProps {
    event: EventType;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function EventRegisterPage() {
    const { event, flash } = usePage().props as unknown as EventRegisterPageProps;
    const [nik, setNik] = useState('');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        router.post(
            `/events/${event.id}/register`,
            {
                nik: nik,
            },
            {
                onSuccess: () => {
                    setNik('');
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
            <div className="min-h-screen bg-gray-50">
                <Header title="Pendaftaran Event" icon="📝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Pendaftaran Event" description="Pendaftaran Event" />

                    {/* Event Information Card */}
                    <div className="mb-8 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
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

                    {/* Registration Form */}
                    <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold text-green-900">Form Pendaftaran</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <InputField
                                    label="Nomor Induk Kependudukan (NIK)"
                                    id="nik"
                                    type="number"
                                    placeholder="Masukkan NIK Anda (16 digit)"
                                    value={nik}
                                    onChange={setNik}
                                    required
                                    helperText="Pastikan NIK yang dimasukkan sudah terdaftar di sistem desa"
                                />
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                <Button type="button" variant="outline" onClick={() => router.visit('/events')} className="w-full sm:w-auto">
                                    Kembali ke Daftar Event
                                </Button>

                                <Button type="submit" disabled={isLoading || nik.length !== 16}>
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
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default EventRegisterPage;
