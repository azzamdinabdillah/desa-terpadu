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
import { PaginatedSocialAidPrograms, SocialAidProgram } from '@/types/socialAid/socialAidTypes';
import { router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, Circle, Edit, Eye, HandHeart, MapPin, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SocialAidPageProps {
    programs: PaginatedSocialAidPrograms;
    filters: {
        search?: string;
        type?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const typeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'individual', label: 'Individu' },
    { value: 'household', label: 'Keluarga' },
    { value: 'public', label: 'Publik' },
];

function SocialAidPage() {
    const { programs, filters, flash } = usePage<SocialAidPageProps>().props;
    const { isAdmin } = useAuth();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [alert, setAlert] = useState<AlertProps | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== (filters.search || '') || selectedType !== (filters.type || 'all')) {
                router.get(
                    '/social-aid',
                    {
                        search: searchQuery || undefined,
                        type: selectedType !== 'all' ? selectedType : undefined,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, selectedType, filters.search, filters.type]);

    const calculateCollectionRate = (program: SocialAidProgram) => {
        const total = program.recipients_count || 0;
        if (total === 0) return 0;
        const collected = program.collected_count || 0;
        return Math.round((collected / total) * 100);
    };

    const columns = useMemo(
        () => [
            {
                key: 'program_name',
                header: 'Nama Program',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="flex items-center gap-2">
                        <HandHeart className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">{item.program_name}</span>
                    </div>
                ),
            },
            {
                key: 'type',
                header: 'Tipe',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => <StatusBadge type="socialAidType" value={item.type} />,
            },
            {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => <StatusBadge type="socialAidStatus" value={item.status} />,
            },
            {
                key: 'period',
                header: 'Periode',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.period}</span>
                    </div>
                ),
            },
            {
                key: 'date_range',
                header: 'Tanggal',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="text-sm">
                        <div className="text-green-900">{formatDate(item.date_start)}</div>
                        <div className="text-xs text-green-600">s/d {formatDate(item.date_end)}</div>
                    </div>
                ),
            },
            {
                key: 'location',
                header: 'Lokasi',
                cell: (item: SocialAidProgram) => (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.location}</span>
                    </div>
                ),
            },
            {
                key: 'quota',
                header: 'Kuota',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => <span className="text-sm font-semibold text-green-900">{item.quota}</span>,
            },
            {
                key: 'recipients',
                header: 'Penerima',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="text-center">
                        <span className="text-sm font-semibold text-green-900">{item.recipients_count || 0}</span>
                        <div className="text-xs text-green-600">
                            <div className="flex justify-center gap-3">
                                <span className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    {item.collected_count || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Circle className="h-3 w-3 text-gray-400" />
                                    {item.not_collected_count || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'collection_rate',
                header: 'Tingkat Pengambilan',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => {
                    const rate = calculateCollectionRate(item);
                    return (
                        <div className="min-w-[80px]">
                            <div className="mb-1 flex justify-between text-xs text-green-700">
                                <span>{rate}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-green-200">
                                <div className="h-1.5 rounded-full bg-green-600 transition-all duration-300" style={{ width: `${rate}%` }}></div>
                            </div>
                        </div>
                    );
                },
            },
            {
                key: 'created_at',
                header: 'Dibuat',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
            {
                key: 'actions',
                header: 'Aksi',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidProgram) => (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.visit(`/social-aid/${item.id}`)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                            <Button variant="ghost" onClick={() => router.visit(`/social-aid/${item.id}/edit`)}>
                                <Edit className="h-4 w-4" />
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
                <Header title="Program Bantuan Sosial" icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Program Bantuan Sosial"
                        description="Kelola program bantuan sosial desa"
                        search={filters?.search ?? ''}
                        total={programs?.total || 0}
                    />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari program bantuan sosial..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                label=""
                                options={typeOptions}
                                value={selectedType}
                                onChange={setSelectedType}
                                placeholder="Filter berdasarkan tipe"
                                className="w-48"
                            />

                            {isAdmin && (
                                <Button onClick={() => router.visit('/social-aid/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                    Tambah Program
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Social Aid Programs Table */}
                    <DataTable
                        columns={columns}
                        data={programs.data || []}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <HandHeart className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada program bantuan sosial</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.search || (filters.type && filters.type !== 'all')
                                        ? 'Tidak ada program yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada program bantuan sosial yang dibuat.'}
                                </p>
                                {isAdmin && (
                                    <Button
                                        onClick={() => router.visit('/social-aid/create')}
                                        icon={<Plus className="h-4 w-4" />}
                                        iconPosition="left"
                                        className="mx-auto"
                                    >
                                        Tambah Program Pertama
                                    </Button>
                                )}
                            </div>
                        }
                    />

                    {/* Pagination */}
                    <Pagination
                        page={programs.current_page}
                        perPage={programs.per_page}
                        total={programs.total}
                        lastPage={programs.last_page}
                        prevUrl={programs.prev_page_url}
                        nextUrl={programs.next_page_url}
                        links={programs.links}
                        onChange={(url: string) => {
                            if (url) {
                                router.visit(url, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default SocialAidPage;
