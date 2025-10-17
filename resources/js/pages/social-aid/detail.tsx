import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
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
import { Calendar, CheckCircle, Circle, Clock, Edit, FileImage, HandHeart, Info, MapPin, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

    const recipientColumns = useMemo(
        () => [
            {
                key: 'recipient_name',
                header: 'Nama Penerima',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-green-900">{item.citizen?.full_name || item.family?.family_name || '-'}</span>
                            <div className="text-xs text-green-600">{item.citizen?.nik || item.family?.kk_number || '-'}</div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'contact',
                header: 'Kontak',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => <span className="text-sm text-green-900">{item.citizen?.phone_number || '-'}</span>,
            },
            {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => <StatusBadge type="status" value={item.status} />,
            },
            {
                key: 'collected_at',
                header: 'Tanggal Ambil',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center gap-2">
                        {item.status === 'collected' ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-900">{item.collected_at ? formatDate(item.collected_at) : '-'}</span>
                            </>
                        ) : (
                            <>
                                <Circle className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">Belum diambil</span>
                            </>
                        )}
                    </div>
                ),
            },
            {
                key: 'performed_by',
                header: 'Ditangani Oleh',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => <span className="text-sm text-green-900">{item.performed_by?.citizen?.full_name || '-'}</span>,
            },
            {
                key: 'notes',
                header: 'Catatan',
                cell: (item: SocialAidRecipient) => <span className="block max-w-xs truncate text-sm text-green-900">{item.note || '-'}</span>,
            },
            {
                key: 'image_proof',
                header: 'Foto Bukti',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center justify-center">
                        {item.image_proof ? (
                            <div className="group relative">
                                <img
                                    src={`${import.meta.env.VITE_APP_URL}/storage/${item.image_proof}`}
                                    alt="Bukti penerimaan"
                                    className="h-10 w-10 cursor-pointer rounded-lg border border-green-200 object-cover transition-transform hover:scale-105"
                                    onClick={() => {
                                        // Open image in new tab
                                        window.open(`/storage/${item.image_proof}`, '_blank');
                                    }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://placehold.co/48x48?text=No+Image';
                                        target.alt = 'Flyer tidak tersedia';
                                        target.className = 'h-12 w-12 rounded border border-green-100 object-cover opacity-60';
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                                <FileImage className="h-4 w-4 text-gray-400" />
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: 'Dibuat',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
        ],
        [],
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
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {program.image ? (
                                        <img
                                            src={`${import.meta.env.VITE_APP_URL}/storage/${program.image}`}
                                            alt={program.program_name}
                                            className="h-20 w-20 rounded-lg border border-green-200 object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://placehold.co/80x80?text=No+Image';
                                                target.alt = 'Gambar tidak tersedia';
                                                target.className = 'h-20 w-20 rounded-lg object-cover border border-green-100 opacity-60';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-green-200 bg-green-100">
                                            <HandHeart className="h-10 w-10 text-green-600" />
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="mb-2 text-2xl font-bold text-green-900">{program.program_name}</h1>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-green-700">
                                            <div className="flex items-center gap-1">
                                                <StatusBadge type="socialAidType" value={program.type} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <StatusBadge type="socialAidStatus" value={program.status} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {program.period}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {program.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <Button
                                        onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/social-aid/${program.id}/edit`)}
                                        icon={<Edit className="h-4 w-4" />}
                                        iconPosition="left"
                                    >
                                        Edit Program
                                    </Button>
                                )}
                            </div>

                            {program.description && (
                                <div className="mb-6">
                                    <h3 className="mb-2 text-lg font-semibold text-green-900">Deskripsi Program</h3>
                                    <p className="leading-relaxed text-green-700">{program.description}</p>
                                </div>
                            )}

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Total Kuota</p>
                                            <p className="text-2xl font-bold text-green-900">{program.quota}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Total Penerima</p>
                                            <p className="text-2xl font-bold text-green-900">{totalRecipients}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Sudah Diambil</p>
                                            <p className="text-2xl font-bold text-green-900">{collectedCount}</p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Belum Diambil</p>
                                            <p className="text-2xl font-bold text-green-900">{notCollectedCount}</p>
                                        </div>
                                        <Circle className="h-8 w-8 text-gray-400" />
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
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <DetailItem icon={Calendar} label="Tanggal Mulai" value={formatDate(program.date_start)} />
                                    <DetailItem icon={Calendar} label="Tanggal Selesai" value={formatDate(program.date_end)} />
                                    <DetailItem icon={Clock} label="Dibuat" value={formatDate(program.created_at)} withBorder={false} />
                                    <DetailItem icon={Clock} label="Diperbarui" value={formatDate(program.updated_at)} withBorder={false} />
                                </div>
                            </div>
                        </DetailCard>
                    </div>

                    {/* Recipients Table */}
                    {program.type !== 'public' ? (
                        <DetailCard title="Daftar Penerima Bantuan" icon={Users}>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-green-600">{totalRecipients} penerima terdaftar</span>
                            </div>

                            <DataTable
                                columns={recipientColumns}
                                data={program.recipients || []}
                                emptyMessage={
                                    <div>
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <Users className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-green-900">Belum ada penerima bantuan</h3>
                                        <p className="mb-6 text-green-700">Program ini belum memiliki penerima bantuan yang terdaftar.</p>
                                    </div>
                                }
                            />
                        </DetailCard>
                    ) : null}
                </div>
            </div>
        </BaseLayouts>
    );
}

export default SocialAidDetailPage;
