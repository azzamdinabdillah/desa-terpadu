import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Baby, Calendar, Home, MapPin, User, Users } from 'lucide-react';
import { FamilyType } from '@/types/familyType';
import { CitizenType } from '@/types/citizen/citizenType';
import { formatDate } from '@/lib/utils';

interface FamilyDetailProps {
    family: FamilyType;
    headOfHousehold: CitizenType | null;
    spouse: CitizenType | null;
    children: CitizenType[];
}

export default function FamilyDetail({ family, headOfHousehold, spouse, children }: FamilyDetailProps) {
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'head_of_household':
                return 'Kepala Keluarga';
            case 'spouse':
                return 'Pasangan';
            case 'child':
                return 'Anak';
            default:
                return status;
        }
    };

    const totalMembers = (headOfHousehold ? 1 : 0) + (spouse ? 1 : 0) + children.length;

    return (
        <BaseLayouts>
            <Head title={`Detail Keluarga ${family.family_name}`} />

            <div>
                <Header showBackButton title="Detail Keluarga" icon="🏠" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title={family.family_name} description={`Detail informasi keluarga ${family.family_name}`} total={totalMembers} />

                    {/* Family Info Card */}
                    <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200 shadow-md">
                                        <Home className="h-6 w-6 text-green-800" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-green-900">{family.family_name}</h1>
                                        <p className="text-sm text-green-600">Keluarga</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-500">No. KK:</span>
                                        <span className="font-medium text-green-900">{family.kk_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-500">Alamat:</span>
                                        <span className="font-medium text-green-900">{family.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-500">Dibuat:</span>
                                        <span className="font-medium text-green-900">{formatDate(family.created_at || '')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-500">Total Anggota:</span>
                                        <span className="font-bold text-green-900">{totalMembers} orang</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Head of Household Section */}
                    {headOfHousehold && (
                        <div className="mb-8">
                            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                                <User className="mr-2 h-5 w-5 text-purple-600" />
                                Kepala Keluarga
                            </h2>

                            <div className="overflow-hidden rounded-xl border border-purple-200 bg-purple-50 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 shadow-md">
                                                    <User className="h-6 w-6 text-purple-800" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-purple-900">{headOfHousehold.full_name}</h3>
                                                    <p className="text-sm text-purple-600">{getStatusLabel(headOfHousehold.status || '')}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <span className="text-gray-500">NIK:</span>
                                                    <span className="ml-2 font-medium text-purple-900">{headOfHousehold.nik}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Jenis Kelamin:</span>
                                                    <span className="ml-2 font-medium text-purple-900 capitalize">
                                                        {headOfHousehold.gender === 'male'
                                                            ? 'Laki-laki'
                                                            : headOfHousehold.gender === 'female'
                                                            ? 'Perempuan'
                                                            : headOfHousehold.gender}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Tanggal Lahir:</span>
                                                    <span className="ml-2 font-medium text-purple-900">
                                                        {formatDate(headOfHousehold.date_of_birth || '')} ({calculateAge(headOfHousehold.date_of_birth || '')}{' '}
                                                        tahun)
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Pekerjaan:</span>
                                                    <span className="ml-2 font-medium text-purple-900">{headOfHousehold.occupation || '-'}</span>
                                                </div>
                                                {headOfHousehold.phone_number && (
                                                    <div>
                                                        <span className="text-gray-500">Telepon:</span>
                                                        <span className="ml-2 font-medium text-purple-900">{headOfHousehold.phone_number}</span>
                                                    </div>
                                                )}
                                                {headOfHousehold.religion && (
                                                    <div>
                                                        <span className="text-gray-500">Agama:</span>
                                                        <span className="ml-2 font-medium text-purple-900 capitalize">
                                                            {headOfHousehold.religion}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Spouse Section */}
                    {spouse && (
                        <div className="mb-8">
                            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                                <User className="mr-2 h-5 w-5 text-blue-600" />
                                Pasangan
                            </h2>

                            <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200 shadow-md">
                                                    <User className="h-6 w-6 text-blue-800" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-blue-900">{spouse.full_name}</h3>
                                                    <p className="text-sm text-blue-600">{getStatusLabel(spouse.status || '')}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <span className="text-gray-500">NIK:</span>
                                                    <span className="ml-2 font-medium text-blue-900">{spouse.nik}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Jenis Kelamin:</span>
                                                    <span className="ml-2 font-medium text-blue-900">
                                                        {spouse.gender === 'male'
                                                            ? 'Laki-laki'
                                                            : spouse.gender === 'female'
                                                            ? 'Perempuan'
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Tanggal Lahir:</span>
                                                    <span className="ml-2 font-medium text-blue-900">
                                                        {formatDate(spouse.date_of_birth || '')} ({calculateAge(spouse.date_of_birth || '')} tahun)
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Pekerjaan:</span>
                                                    <span className="ml-2 font-medium text-blue-900">{spouse.occupation || '-'}</span>
                                                </div>
                                                {spouse.phone_number && (
                                                    <div>
                                                        <span className="text-gray-500">Telepon:</span>
                                                        <span className="ml-2 font-medium text-blue-900">{spouse.phone_number}</span>
                                                    </div>
                                                )}
                                                {spouse.religion && (
                                                    <div>
                                                        <span className="text-gray-500">Agama:</span>
                                                        <span className="ml-2 font-medium text-blue-900 capitalize">{spouse.religion}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Children Section */}
                    {children && (
                        <div className="mb-8">
                            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                                <Baby className="mr-2 h-5 w-5 text-green-600" />
                                Anak-anak ({children.length} orang)
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {children.map((child) => (
                                    <div
                                        key={child.id}
                                        className="overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200 shadow-md">
                                                    <Baby className="h-6 w-6 text-green-800" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-green-900">{child.full_name}</h3>
                                                    <p className="text-sm text-green-600">{getStatusLabel(child.status || '')}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500">NIK:</span>
                                                    <span className="ml-2 font-medium text-green-900">{child.nik}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Jenis Kelamin:</span>
                                                    <span className="ml-2 font-medium text-green-900 capitalize">
                                                        {child.gender === 'male' ? 'Laki-laki' : child.gender === 'female' ? 'Perempuan' : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Tanggal Lahir:</span>
                                                    <span className="ml-2 font-medium text-green-900">
                                                        {formatDate(child.date_of_birth || '')} ({calculateAge(child.date_of_birth || '')} tahun)
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Pekerjaan:</span>
                                                    <span className="ml-2 font-medium text-green-900">{child.occupation || '-'}</span>
                                                </div>
                                                {child.phone_number && (
                                                    <div>
                                                        <span className="text-gray-500">Telepon:</span>
                                                        <span className="ml-2 font-medium text-green-900">{child.phone_number}</span>
                                                    </div>
                                                )}
                                                {child.religion && (
                                                    <div>
                                                        <span className="text-gray-500">Agama:</span>
                                                        <span className="ml-2 font-medium text-green-900 capitalize">{child.religion}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No family members message */}
                    {!headOfHousehold && !spouse && children.length === 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">Belum Ada Anggota Keluarga</h3>
                            <p className="text-gray-500">Keluarga ini belum memiliki anggota yang terdaftar.</p>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayouts>
    );
}
