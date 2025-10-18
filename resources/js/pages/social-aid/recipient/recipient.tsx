import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
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
import { SocialAidProgram, SocialAidRecipient } from '@/types/socialAid/socialAidTypes';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, CheckCircle, Circle, FileImage, Filter, HandHeart, Plus, Search, StickyNote, Trash2, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SocialAidRecipientPageProps {
    recipients: {
        data: SocialAidRecipient[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    programs: SocialAidProgram[];
    filters: {
        search?: string;
        program_id?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'collected', label: 'Sudah Diambil' },
    { value: 'not_collected', label: 'Belum Diambil' },
];

function SocialAidRecipientPage() {
    const { recipients, programs, filters, flash } = usePage<SocialAidRecipientPageProps>().props;
    const { isAdmin } = useAuth();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedProgram, setSelectedProgram] = useState(filters.program_id || 'all_programs');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [tempSelectedProgram, setTempSelectedProgram] = useState(filters.program_id || 'all_programs');
    const [programSearchQuery, setProgramSearchQuery] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recipientToDelete, setRecipientToDelete] = useState<SocialAidRecipient | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            if (
                searchQuery !== (filters.search || '') ||
                selectedProgram !== (filters.program_id || 'all_programs') ||
                selectedStatus !== (filters.status || 'all')
            ) {
                router.get(
                    `${import.meta.env.VITE_APP_SUB_URL}/recipients`,
                    {
                        search: searchQuery || undefined,
                        program_id: selectedProgram !== 'all_programs' ? selectedProgram : undefined,
                        status: selectedStatus !== 'all' ? selectedStatus : undefined,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, selectedProgram, selectedStatus, filters.search, filters.program_id, filters.status]);

    // Handle program modal
    const handleOpenProgramModal = () => {
        setTempSelectedProgram(selectedProgram);
        setProgramSearchQuery('');
        setIsProgramModalOpen(true);
    };

    const handleCloseProgramModal = () => {
        setIsProgramModalOpen(false);
    };

    const handleApplyProgramFilter = () => {
        setSelectedProgram(tempSelectedProgram);
        setIsProgramModalOpen(false);
    };

    const handleClearProgramFilter = () => {
        setTempSelectedProgram('all_programs');
    };

    // Handle delete functionality
    const handleDeleteClick = (recipient: SocialAidRecipient) => {
        setRecipientToDelete(recipient);
        setDeleteModalOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteModalOpen(false);
        setRecipientToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (!recipientToDelete) return;

        setIsDeleting(true);
        router.delete(`${import.meta.env.VITE_APP_SUB_URL}/recipients/${recipientToDelete.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setRecipientToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    // Filter programs based on search query
    const filteredPrograms = useMemo(() => {
        if (!programSearchQuery.trim()) {
            return programs;
        }

        const query = programSearchQuery.toLowerCase();
        return programs.filter((program) => program.program_name.toLowerCase().includes(query) || program.period.toLowerCase().includes(query));
    }, [programs, programSearchQuery]);

    const columns = useMemo(
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
                        {isAdmin && (
                            <div>
                                <span className="text-sm font-medium text-green-900">
                                    {item.citizen?.full_name || item.family?.family_name || '-'}
                                </span>
                                <div className="text-xs text-green-600">{item.citizen?.nik || item.family?.kk_number || '-'}</div>
                            </div>
                        )}
                    </div>
                ),
            },
            // {
            //     key: 'email',
            //     header: 'Email',
            //     className: 'whitespace-nowrap',
            //     cell: (item: SocialAidRecipient) => <span className="text-sm text-green-900">{item.citizen?.email || '-'}</span>,
            // },
            {
                key: 'program',
                header: 'Program',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center gap-2">
                        <HandHeart className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">{item.program?.program_name || '-'}</span>
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
                                        window.open(`${import.meta.env.VITE_APP_URL}/storage/${item.image_proof}`, '_blank');
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
            {
                key: 'actions',
                header: 'Aksi',
                className: 'whitespace-nowrap',
                cell: (item: SocialAidRecipient) => (
                    <div className="flex items-center gap-2">
                        {isAdmin && item.status !== 'collected' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/recipients/${item.id}/action`)}
                                icon={<StickyNote className="h-4 w-4" />}
                            >
                                Aksi
                            </Button>
                        )}
                        {/* <Button variant="ghost" onClick={() => router.visit(`/${item.program_id}`)} title="Lihat Program">
                            <Eye className="h-4 w-4" />
                        </Button> */}
                        {isAdmin && item.status !== 'collected' && (
                            <Button variant="red" size="sm" onClick={() => handleDeleteClick(item)} icon={<Trash2 className="h-4 w-4" />}>
                                Hapus
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
                <Header title="Penerima Bantuan Sosial" icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Penerima Bantuan Sosial"
                        description="Kelola data penerima bantuan sosial desa"
                        search={filters?.search ?? ''}
                        total={recipients?.total || 0}
                    />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari penerima bantuan sosial..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={handleOpenProgramModal}
                                variant="outline"
                                icon={<Filter className="h-4 w-4" />}
                                iconPosition="left"
                                className="w-auto"
                            >
                                {selectedProgram === 'all_programs'
                                    ? 'Filter Program'
                                    : programs.find((p) => p.id.toString() === selectedProgram)?.program_name || 'Filter Program'}
                            </Button>

                            <Select
                                label=""
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                placeholder="Filter berdasarkan status"
                                className="w-48"
                            />

                            {isAdmin && (
                                <Button
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/recipients/create`)}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                >
                                    Tambah Penerima
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Recipients Table */}
                    <DataTable
                        columns={columns}
                        data={recipients.data || []}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada penerima bantuan sosial</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.search || filters.program_id || (filters.status && filters.status !== 'all')
                                        ? 'Tidak ada penerima yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada penerima bantuan sosial yang terdaftar.'}
                                </p>
                            </div>
                        }
                    />

                    {/* Pagination */}
                    <Pagination
                        page={recipients.current_page}
                        perPage={recipients.per_page}
                        total={recipients.total}
                        lastPage={recipients.last_page}
                        prevUrl={recipients.prev_page_url}
                        nextUrl={recipients.next_page_url}
                        links={recipients.links}
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

                {/* Program Filter Modal */}
                <Dialog.Root open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                            <div className="flex h-full max-h-[90vh] flex-col">
                                <div className="flex flex-shrink-0 items-center justify-between border-b border-green-200 p-6 pb-4">
                                    <Dialog.Title className="text-lg font-semibold text-green-900">Filter Program Bantuan</Dialog.Title>
                                    <Dialog.Close asChild>
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </Dialog.Close>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 pt-4">
                                    <div className="mb-6">
                                        <p className="mb-4 text-sm text-green-700">Pilih program bantuan sosial untuk memfilter data penerima:</p>

                                        {/* Search Input */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Search className="h-5 w-5 text-green-600" />
                                                </div>
                                                <InputField
                                                    type="text"
                                                    placeholder="Cari program bantuan sosial..."
                                                    value={programSearchQuery}
                                                    onChange={setProgramSearchQuery}
                                                    inputClassName="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-96 space-y-2 overflow-y-auto">
                                            <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-green-200 p-3 hover:bg-green-50">
                                                <input
                                                    type="radio"
                                                    name="program"
                                                    value="all_programs"
                                                    checked={tempSelectedProgram === 'all_programs'}
                                                    onChange={(e) => setTempSelectedProgram(e.target.value)}
                                                    className="h-4 w-4 border-green-300 text-green-600 focus:ring-green-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-green-900">Semua Program</div>
                                                    <div className="text-xs text-green-600">Tampilkan semua penerima dari semua program</div>
                                                </div>
                                            </label>

                                            {filteredPrograms.length > 0 ? (
                                                filteredPrograms.map((program) => (
                                                    <label
                                                        key={program.id}
                                                        className="flex cursor-pointer items-center space-x-3 rounded-lg border border-green-200 p-3 hover:bg-green-50"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="program"
                                                            value={program.id.toString()}
                                                            checked={tempSelectedProgram === program.id.toString()}
                                                            onChange={(e) => setTempSelectedProgram(e.target.value)}
                                                            className="h-4 w-4 border-green-300 text-green-600 focus:ring-green-500"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-green-900">{program.program_name}</div>
                                                            <div className="text-xs text-green-600">Periode: {program.period}</div>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="text-center">
                                                        <Search className="mx-auto h-8 w-8 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-500">Tidak ada program yang sesuai dengan pencarian</p>
                                                        <p className="text-xs text-gray-400">Coba kata kunci lain</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-shrink-0 flex-wrap justify-between gap-3 border-t border-green-200 p-6 pt-4">
                                    <Button
                                        onClick={handleClearProgramFilter}
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        Hapus Filter
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleCloseProgramModal}
                                            variant="outline"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Batal
                                        </Button>
                                        <Button onClick={handleApplyProgramFilter} icon={<Filter className="h-4 w-4" />} iconPosition="left">
                                            Terapkan Filter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={handleDeleteClose}
                    onConfirm={handleDeleteConfirm}
                    title="Konfirmasi Hapus"
                    message={
                        recipientToDelete ? (
                            <div>
                                <p className="mb-4">Apakah Anda yakin ingin menghapus penerima bantuan sosial ini?</p>
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                                    <p className="text-sm font-medium text-red-900">Detail Penerima:</p>
                                    <p className="text-sm text-red-800">
                                        {recipientToDelete.citizen?.full_name || recipientToDelete.family?.family_name} -{' '}
                                        {recipientToDelete.program?.program_name}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            'Apakah Anda yakin ingin menghapus penerima bantuan sosial ini?'
                        )
                    }
                    confirmText="Hapus"
                    cancelText="Batal"
                    isLoading={isDeleting}
                />
            </div>
        </BaseLayouts>
    );
}

export default SocialAidRecipientPage;
