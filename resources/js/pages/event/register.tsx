import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, UserCheck } from 'lucide-react';
import { useState } from 'react';

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
    created_by: {
        id: number;
        full_name: string;
    };
    participants: Array<{
        id: number;
        citizen_id: number;
        citizen: {
            id: number;
            full_name: string;
        };
    }>;
    created_at: string;
    updated_at: string;
}

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

    useState(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center space-x-2 text-sm">
                        <button onClick={() => router.visit('/events')} className="text-green-600 hover:text-green-700 hover:underline">
                            Daftar Event
                        </button>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">Pendaftaran</span>
                    </nav>

                    {/* Event Information Card */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                            {/* Event Image */}
                            <div className="flex-shrink-0 self-center sm:self-start">
                                {event.flyer ? (
                                    <img
                                        src={`/storage/${event.flyer}`}
                                        alt={event.event_name}
                                        className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-green-100">
                                        <Calendar className="h-12 w-12 text-green-600" />
                                    </div>
                                )}
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{event.event_name}</h1>
                                    {event.description && <p className="mt-2 text-gray-600">{event.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Tanggal Mulai</p>
                                            <p className="text-sm text-gray-600">{formatDate(event.date_start)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Tanggal Selesai</p>
                                            <p className="text-sm text-gray-600">{formatDate(event.date_end)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Lokasi</p>
                                            <p className="text-sm text-gray-600">{event.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <UserCheck className="h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Jumlah Peserta</p>
                                            <p className="text-sm text-gray-600">
                                                {event.participants.length}
                                                {event.max_participants && ` / ${event.max_participants}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900">Form Pendaftaran</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <InputField
                                    label="Nomor Induk Kependudukan (NIK)"
                                    id="nik"
                                    type="text"
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

                                <Button
                                    type="submit"
                                    disabled={isLoading || nik.length !== 16}
                                >
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
