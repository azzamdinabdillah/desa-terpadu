import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { SocialAidProgram, SocialAidRecipient } from '@/types/socialAid/socialAidTypes';
import { router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, Circle, Clock, Edit, HandHeart, Info, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialAidDetailPageProps {
    program: SocialAidProgram & {
        recipients: SocialAidRecipient[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function SocialAidDetailPage() {
    const { program, flash } = usePage<SocialAidDetailPageProps>().props;
    const { isAdmin } = useAuth();
    const [alert, setAlert] = useState<AlertProps | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const calculateCollectionRate = () => {
        const total = program.recipients?.length || 0;
        if (total === 0) return 0;
        const collected = program.recipients?.filter((r) => r.status === 'collected').length || 0;
        return Math.round((collected / total) * 100);
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            individual: 'Individu',
            household: 'Keluarga',
            public: 'Publik',
        };
        return types[type] || type;
    };

    // Recipient Card Component
    const RecipientCard = ({ recipient }: { recipient: SocialAidRecipient }) => (
        <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-3">
                {/* Header with avatar and name */}
                <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div className='flex flex-wrap gap-3 justify-between'>
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                            <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-green-900">
                                {recipient.citizen?.full_name || recipient.family?.family_name || '-'}
                            </h3>
                            <p className="truncate text-xs text-green-600">{recipient.citizen?.nik || recipient.family?.kk_number || '-'}</p>
                        </div>
                    </div>
                    <StatusBadge type="status" value={recipient.status} />
                </div>

                {/* Contact info */}
                {recipient.citizen?.phone_number && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <span className="font-medium">Kontak:</span>
                        <span>{recipient.citizen.phone_number}</span>
                    </div>
                )}

                {/* Collection status */}
                <div className="flex items-center gap-2 text-sm">
                    {recipient.status === 'collected' ? (
                        <>
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                            <span className="text-green-900">Diambil pada {recipient.collected_at ? formatDate(recipient.collected_at) : '-'}</span>
                        </>
                    ) : (
                        <>
                            <Circle className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span className="text-gray-500">Belum diambil</span>
                        </>
                    )}
                </div>

                {/* Handled by */}
                {recipient.performed_by?.citizen?.full_name && (
                    <div className="flex items-center gap-2 text-sm text-green-700 flex-wrap">
                        <span className="font-medium">Ditangani oleh:</span>
                        <span>{recipient.performed_by.citizen.full_name}</span>
                    </div>
                )}

                {/* Notes */}
                {recipient.note && (
                    <div className="text-sm text-green-700">
                        <span className="font-medium">Catatan:</span>
                        <p className="mt-1 text-green-600">{recipient.note}</p>
                    </div>
                )}

                {/* Image proof */}
                {recipient.image_proof && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-700">Foto Bukti:</span>
                        <div className="group relative">
                            <img
                                src={`${import.meta.env.VITE_APP_URL}/storage/${recipient.image_proof}`}
                                alt="Bukti penerimaan"
                                className="h-12 w-12 cursor-pointer rounded-lg border border-green-200 object-cover transition-transform hover:scale-105"
                                onClick={() => {
                                    window.open(`${import.meta.env.VITE_APP_URL}/storage/${recipient.image_proof}`, '_blank');
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/48x48?text=No+Image';
                                    target.alt = 'Bukti tidak tersedia';
                                    target.className = 'h-12 w-12 rounded border border-green-100 object-cover opacity-60';
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Created date */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Dibuat {formatDate(recipient.created_at)}</span>
                </div>
            </div>
        </div>
    );

    const collectionRate = calculateCollectionRate();
    const totalRecipients = program.recipients?.length || 0;
    const collectedCount = program.recipients?.filter((r) => r.status === 'collected').length || 0;
    const notCollectedCount = totalRecipients - collectedCount;

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title="Detail Program Bantuan Sosial" icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Detail Program Bantuan Sosial" description="Detail program bantuan sosial" />
                    {/* Program Information Card */}
                    <div className="mb-8">
                        <DetailCard title="Informasi Program" icon={Info}>
                            <div className="mb-6">
                                {/* Mobile-first layout */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        {program.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_APP_URL}/storage/${program.image}`}
                                                alt={program.program_name}
                                                className="h-16 w-16 flex-shrink-0 rounded-lg border border-green-200 object-cover sm:h-20 sm:w-20"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://placehold.co/80x80?text=No+Image';
                                                    target.alt = 'Gambar tidak tersedia';
                                                    target.className =
                                                        'h-16 w-16 flex-shrink-0 rounded-lg object-cover border border-green-100 opacity-60 sm:h-20 sm:w-20';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-100 sm:h-20 sm:w-20">
                                                <HandHeart className="h-8 w-8 text-green-600 sm:h-10 sm:w-10" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h1 className="mb-2 text-xl font-bold text-green-900 sm:text-2xl">{program.program_name}</h1>
                                            <div className="flex flex-wrap gap-2 text-sm text-green-700 sm:items-center sm:gap-4">
                                                <div className="flex items-center gap-1">
                                                    <StatusBadge type="socialAidType" value={program.type} />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <StatusBadge type="socialAidStatus" value={program.status} />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">{program.period}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">{program.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex justify-end sm:flex-shrink-0">
                                            <Button
                                                onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/social-aid/${program.id}/edit`)}
                                                icon={<Edit className="h-4 w-4" />}
                                                iconPosition="left"
                                                className="w-full sm:w-auto"
                                            >
                                                <span className="hidden sm:inline">Edit Program</span>
                                                <span className="sm:hidden">Edit</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {program.description && (
                                <div className="mb-6">
                                    <h3 className="mb-2 text-lg font-semibold text-green-900">Deskripsi Program</h3>
                                    <p className="leading-relaxed text-green-700">{program.description}</p>
                                </div>
                            )}

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-green-600 sm:text-sm">Total Kuota</p>
                                            <p className="text-xl font-bold text-green-900 sm:text-2xl">{program.quota}</p>
                                        </div>
                                        <Users className="h-6 w-6 flex-shrink-0 text-green-600 sm:h-8 sm:w-8" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-green-600 sm:text-sm">Total Penerima</p>
                                            <p className="text-xl font-bold text-green-900 sm:text-2xl">{totalRecipients}</p>
                                        </div>
                                        <Users className="h-6 w-6 flex-shrink-0 text-green-600 sm:h-8 sm:w-8" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-green-600 sm:text-sm">Sudah Diambil</p>
                                            <p className="text-xl font-bold text-green-900 sm:text-2xl">{collectedCount}</p>
                                        </div>
                                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600 sm:h-8 sm:w-8" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-green-600 sm:text-sm">Belum Diambil</p>
                                            <p className="text-xl font-bold text-green-900 sm:text-2xl">{notCollectedCount}</p>
                                        </div>
                                        <Circle className="h-6 w-6 flex-shrink-0 text-gray-400 sm:h-8 sm:w-8" />
                                    </div>
                                </div>
                            </div>

                            {/* Collection Rate Progress */}
                            <div className="mt-6">
                                <div className="mb-2 flex justify-between text-sm text-green-700">
                                    <span>Tingkat Pengambilan</span>
                                    <span className="font-semibold">{collectionRate}%</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-green-200">
                                    <div
                                        className="h-3 rounded-full bg-green-600 transition-all duration-300"
                                        style={{ width: `${collectionRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Program Details */}
                            <div className="mt-6">
                                <h4 className="mb-4 text-sm font-semibold text-gray-900">Detail Waktu Program</h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <DetailItem icon={Calendar} label="Tanggal Mulai" value={formatDate(program.date_start)} />
                                    <DetailItem icon={Calendar} label="Tanggal Selesai" value={formatDate(program.date_end)} />
                                    <DetailItem icon={Clock} label="Dibuat" value={formatDate(program.created_at)} withBorder={false} />
                                    <DetailItem icon={Clock} label="Diperbarui" value={formatDate(program.updated_at)} withBorder={false} />
                                </div>
                            </div>
                        </DetailCard>
                    </div>

                    {/* Recipients Cards */}
                    {program.type !== 'public' ? (
                        <DetailCard title="Daftar Penerima Bantuan" icon={Users}>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-green-600">{totalRecipients} penerima terdaftar</span>
                            </div>

                            {program.recipients && program.recipients.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {program.recipients.map((recipient) => (
                                        <RecipientCard key={recipient.id} recipient={recipient} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-green-900">Belum ada penerima bantuan</h3>
                                    <p className="text-green-700">Program ini belum memiliki penerima bantuan yang terdaftar.</p>
                                </div>
                            )}
                        </DetailCard>
                    ) : null}
                </div>
            </div>
        </BaseLayouts>
    );
}

export default SocialAidDetailPage;
