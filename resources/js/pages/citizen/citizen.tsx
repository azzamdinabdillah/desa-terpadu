import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import ImageModal from '@/components/ImageModal';
import InputField from '@/components/InputField';
import ModalSelectSearch from '@/components/ModalSelectSearch';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { calculateAge, formatDate, getGenderLabel, getMaritalStatusLabel, getReligionLabel, getStatusLabel } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { router, usePage } from '@inertiajs/react';
import { Award, Briefcase, Calendar, Edit, Eye, Heart, Home, IdCard, Mail, MapPin, Phone, Plus, Search, Trash2, User, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface CitizenPageProps {
    citizens: {
        data: CitizenType[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    families: Array<{ id: number; name: string; address: string }>;
    filters: {
        q?: string;
        gender?: string;
        family_id?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CitizenPage() {
    const { citizens, families, filters, flash } = usePage().props as unknown as CitizenPageProps;
    const { isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [gender, setGender] = useState(filters.gender || 'all');
    const [selectedFamilyId, setSelectedFamilyId] = useState(filters.family_id || '');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [citizenToDelete, setCitizenToDelete] = useState<CitizenType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedImageAlt, setSelectedImageAlt] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(
            `${import.meta.env.VITE_APP_SUB_URL}/citizens`,
            {
                q: searchTerm,
                gender: gender === 'all' ? undefined : gender,
                family_id: selectedFamilyId || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.q || '') || (filters.gender || 'all') !== gender || (filters.family_id || '') !== selectedFamilyId) {
                router.get(
                    `${import.meta.env.VITE_APP_SUB_URL}/citizens`,
                    {
                        q: searchTerm,
                        gender: gender === 'all' ? undefined : gender,
                        family_id: selectedFamilyId || undefined,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, gender, selectedFamilyId, filters.q, filters.gender, filters.family_id]);

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, { preserveState: true, replace: true });
        }
    };

    const handleDeleteClick = (citizen: CitizenType) => {
        // Check if citizen has admin user account
        if (citizen.user && citizen.user.role === 'admin') {
            setAlert({ type: 'error', message: 'Tidak dapat menghapus warga yang memiliki akun user dengan role admin!' });
            return;
        }
        setCitizenToDelete(citizen);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (citizenToDelete) {
            setIsDeleting(true);
            router.delete(`${import.meta.env.VITE_APP_SUB_URL}/citizens/${citizenToDelete.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCitizenToDelete(null);
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCitizenToDelete(null);
        setIsDeleting(false);
    };

    // Handle image modal
    const handleImageClick = (imageUrl: string, alt: string) => {
        setSelectedImageUrl(imageUrl);
        setSelectedImageAlt(alt);
        setShowImageModal(true);
    };

    const handleImageModalClose = () => {
        setShowImageModal(false);
        setSelectedImageUrl('');
        setSelectedImageAlt('');
    };

    const columns = useMemo(
        () => [
            {
                key: 'full_name',
                header: 'Nama Lengkap',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        {item.profile_picture ? (
                            <img
                                src={`${import.meta.env.VITE_APP_URL}/storage/${item.profile_picture}`}
                                alt={item.full_name}
                                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-green-200 object-cover transition-transform hover:scale-105"
                                onClick={() => handleImageClick(`${import.meta.env.VITE_APP_URL}/storage/${item.profile_picture}`, item.full_name)}
                            />
                        ) : (
                            <Users className="h-8 w-8 rounded-full border border-green-200 bg-green-50 p-1.5 text-green-600" />
                        )}
                        <span className="text-sm text-green-900">{item.full_name}</span>
                    </div>
                ),
            },
            // NIK hanya tampil untuk admin
            ...(isAdmin
                ? [
                      {
                          key: 'nik',
                          header: 'NIK',
                          className: 'whitespace-nowrap',
                          cell: (item: CitizenType) => (
                              <div className="flex items-center gap-2">
                                  <IdCard className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-900">{item.nik}</span>
                              </div>
                          ),
                      },
                      {
                          key: 'role',
                          header: 'Role',
                          className: 'whitespace-nowrap',
                          cell: (item: CitizenType) => {
                              if (!item.user || !item.user.role) {
                                  return <span className="text-sm text-gray-400">-</span>;
                              }

                              return <StatusBadge type="userRole" value={item.user.role} />;
                          },
                      },
                  ]
                : []),
            {
                key: 'gender',
                header: 'Jenis Kelamin',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => {
                    return <span className="text-sm text-green-900 capitalize">{getGenderLabel(item.gender || '')}</span>;
                },
            },
            {
                key: 'date_of_birth',
                header: 'Tanggal Lahir',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.date_of_birth ? formatDate(item.date_of_birth) : '-'}</span>
                    </div>
                ),
            },
            {
                key: 'age',
                header: 'Umur',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.date_of_birth ? `${calculateAge(item.date_of_birth)} tahun` : '-'}</span>
                    </div>
                ),
            },
            {
                key: 'occupation',
                header: 'Pekerjaan',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.occupation || '-'}</span>
                    </div>
                ),
            },
            {
                key: 'position',
                header: 'Jabatan',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.position || '-'}</span>
                    </div>
                ),
            },
            {
                key: 'email',
                header: 'Email',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.email || '-'}</span>
                    </div>
                ),
            },
            {
                key: 'phone_number',
                header: 'No. HP',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.phone_number || '-'}</span>
                    </div>
                ),
            },
            {
                key: 'address',
                header: 'Alamat',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="max-w-xs truncate text-sm text-green-900">{item.address || '-'}</span>
                    </div>
                ),
            },
            {
                key: 'religion',
                header: 'Agama',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => <span className="text-sm text-green-900">{item.religion ? getReligionLabel(item.religion) : '-'}</span>,
            },
            {
                key: 'marital_status',
                header: 'Status Perkawinan',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.marital_status ? getMaritalStatusLabel(item.marital_status) : '-'}</span>
                    </div>
                ),
            },
            {
                key: 'status',
                header: 'Status dalam Keluarga',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{item.status ? getStatusLabel(item.status) : '-'}</span>
                    </div>
                ),
            },
            {
                key: 'familyName',
                header: 'Dari Keluarga',
                className: 'w-full whitespace-nowrap',
                cell: (item: CitizenType) => (
                    <div className="flex w-full items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="w-full text-sm text-green-900">{item.family.family_name || '-'}</span>
                    </div>
                ),
            },
            // hanya admin yang bisa lihat
            {
                key: 'action',
                header: 'Aksi',
                className: 'whitespace-nowrap',
                cell: (item: CitizenType) => {
                    const hasAdminUser = Boolean(item.user && item.user.role === 'admin');
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/citizens/${item.id}`)}
                                icon={<Eye className="h-4 w-4" />}
                            >
                                Detail
                            </Button>
                            {isAdmin && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/citizens/${item.id}/edit`)}
                                        icon={<Edit className="h-4 w-4" />}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="red"
                                        size="sm"
                                        onClick={() => handleDeleteClick(item)}
                                        disabled={hasAdminUser}
                                        className={hasAdminUser ? 'cursor-not-allowed opacity-50' : ''}
                                        icon={<Trash2 className="h-4 w-4" />}
                                        title={
                                            hasAdminUser
                                                ? 'Tidak dapat menghapus warga yang memiliki akun user dengan role admin'
                                                : 'Hapus data warga'
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </>
                            )}
                        </div>
                    );
                },
            },
        ],
        [isAdmin],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Data Penduduk Desa" icon="🧑‍🤝‍🧑" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Warga" description="Daftar seluruh data warga desa" search={filters?.q ?? ''} total={citizens.total} />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari warga (nama, NIK, alamat)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={gender}
                                onChange={(val) => setGender(val)}
                                options={[
                                    { value: 'all', label: 'Semua Jenis Kelamin' },
                                    { value: 'male', label: 'Laki-laki' },
                                    { value: 'female', label: 'Perempuan' },
                                ]}
                                className="min-w-[220px]"
                                placeholder="Pilih gender"
                            />

                            <ModalSelectSearch
                                title="Filter by Keluarga"
                                placeholder="Filter by Keluarga"
                                selectedValue={selectedFamilyId}
                                selectedLabel={selectedFamilyId ? families.find((f) => f.id.toString() === selectedFamilyId)?.name : undefined}
                                items={[
                                    { id: 0, name: 'Semua Keluarga', address: 'Tampilkan semua warga' },
                                    ...families.map((family) => ({
                                        ...family,
                                        address: family.address || undefined,
                                    })),
                                ]}
                                onSelect={(value) => setSelectedFamilyId(value === '0' ? '' : value)}
                            />

                            {isAdmin && (
                                <Button
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/citizens/create`)}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                >
                                    Tambah Data Warga
                                </Button>
                            )}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={citizens.data}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <User className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data warga</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.q || (filters.gender && filters.gender !== 'all')
                                        ? 'Tidak ada warga yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada data warga yang tercatat.'}
                                </p>
                            </div>
                        }
                    />

                    <Pagination
                        page={citizens.current_page}
                        perPage={citizens.per_page}
                        total={citizens.total}
                        lastPage={citizens.last_page}
                        prevUrl={citizens.prev_page_url}
                        nextUrl={citizens.next_page_url}
                        links={citizens.links}
                        onChange={handlePageChange}
                    />
                </div>

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Konfirmasi Hapus Data Warga"
                    message={`Apakah Anda yakin ingin menghapus data warga "${citizenToDelete?.full_name}"? Tindakan ini tidak dapat dibatalkan dan seluruh data yang berkaitan dengan warga ini (misal: kepemilikan akun, keterkaitan keluarga, dan data lain) juga akan diubah atau menjadi kosong (null). Lanjutkan?`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    isLoading={isDeleting}
                />

                {/* Image Modal */}
                <ImageModal isOpen={showImageModal} onClose={handleImageModalClose} imageUrl={selectedImageUrl} alt={selectedImageAlt} />
            </div>
        </BaseLayouts>
    );
}

export default CitizenPage;
