import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Calendar, Edit, Home, MapPin, Phone, User, Users } from 'lucide-react';
import React from 'react';

interface Citizen {
    id: number;
    full_name: string;
    nik: string;
    phone_number?: string;
    address: string;
    date_of_birth: string;
    occupation: string;
    position?: string;
    religion: string;
    marital_status: string;
    gender: string;
    status: string;
    profile_picture?: string;
    family?: {
        id: number;
        family_name: string;
        address: string;
    };
}

interface Props {
    citizen: Citizen;
}

const DetailCitizen: React.FC<Props> = ({ citizen }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'head_of_household':
                return 'bg-blue-100 text-blue-800';
            case 'spouse':
                return 'bg-green-100 text-green-800';
            case 'child':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'head_of_household':
                return 'Kepala Keluarga';
            case 'spouse':
                return 'Istri/Suami';
            case 'child':
                return 'Anak';
            default:
                return status;
        }
    };

    const getGenderLabel = (gender: string) => {
        return gender === 'male' ? 'Laki-laki' : 'Perempuan';
    };

    const getMaritalStatusLabel = (status: string) => {
        switch (status) {
            case 'single':
                return 'Belum Menikah';
            case 'married':
                return 'Menikah';
            case 'widowed':
                return 'Janda/Duda';
            default:
                return status;
        }
    };

    const getReligionLabel = (religion: string) => {
        switch (religion) {
            case 'islam':
                return 'Islam';
            case 'christian':
                return 'Kristen';
            case 'catholic':
                return 'Katolik';
            case 'hindu':
                return 'Hindu';
            case 'buddhist':
                return 'Buddha';
            case 'confucian':
                return 'Konghucu';
            default:
                return religion;
        }
    };

    return (
        <BaseLayouts>
            <Head title={`Detail Warga - ${citizen.full_name}`} />

            <div>
                <Header showBackButton title="Detail Data Warga" icon="👤" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">

                    <HeaderPage
                        title="Detail Warga"
                        description="Detail data warga"
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-green-300 bg-gradient-to-br from-green-100 to-emerald-100 shadow-md">
                                        {citizen.profile_picture ? (
                                            <img
                                                src={`/storage/${citizen.profile_picture}`}
                                                alt={citizen.full_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-16 w-16 text-green-500" />
                                        )}
                                    </div>
                                    <h2 className="mb-2 text-xl font-bold text-green-900">{citizen.full_name}</h2>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(citizen.status)}`}>
                                        {getStatusLabel(citizen.status)}
                                    </span>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center rounded-lg bg-white/70 p-2 text-sm text-green-700">
                                        <Calendar className="mr-2 h-4 w-4 text-green-600" />
                                        <span>{getAge(citizen.date_of_birth)} tahun</span>
                                    </div>
                                    <div className="flex items-center rounded-lg bg-white/70 p-2 text-sm text-green-700">
                                        <User className="mr-2 h-4 w-4 text-green-600" />
                                        <span>{getGenderLabel(citizen.gender)}</span>
                                    </div>
                                    {citizen.phone_number && (
                                        <div className="flex items-center rounded-lg bg-white/70 p-2 text-sm text-green-700">
                                            <Phone className="mr-2 h-4 w-4 text-green-600" />
                                            <span>{citizen.phone_number}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detail Information */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Personal Information */}
                            <div className="overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-md">
                                        <User className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-green-900">Informasi Pribadi</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">NIK</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{citizen.nik}</p>
                                    </div>
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Tanggal Lahir</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{formatDate(citizen.date_of_birth)}</p>
                                    </div>
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Agama</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{getReligionLabel(citizen.religion)}</p>
                                    </div>
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Status Pernikahan</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{getMaritalStatusLabel(citizen.marital_status)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="overflow-hidden rounded-xl border border-green-300 bg-gradient-to-br from-green-100 to-emerald-100 p-6 shadow-lg">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-200 to-emerald-200 shadow-md">
                                        <MapPin className="h-5 w-5 text-green-700" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-green-900">Informasi Alamat</h3>
                                </div>
                                <div className="rounded-lg bg-white/70 p-4">
                                    <label className="text-sm font-medium text-green-600">Alamat</label>
                                    <p className="mt-2 text-sm leading-relaxed font-semibold text-green-900">{citizen.address}</p>
                                </div>
                            </div>

                            {/* Work Information */}
                            <div className="overflow-hidden rounded-xl border border-green-400 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-lg">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-green-200 shadow-md">
                                        <Briefcase className="h-5 w-5 text-green-700" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-green-900">Informasi Pekerjaan</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Pekerjaan</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{citizen.occupation}</p>
                                    </div>
                                    {citizen.position && (
                                        <div className="rounded-lg bg-white/70 p-4">
                                            <label className="text-sm font-medium text-green-600">Jabatan</label>
                                            <p className="mt-1 text-sm font-semibold text-green-900">{citizen.position}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Family Information */}
                            {citizen.family && (
                                <div className="overflow-hidden rounded-xl border border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 p-6 shadow-lg">
                                    <div className="mb-6 flex items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-300 to-emerald-300 shadow-md">
                                            <Users className="h-5 w-5 text-green-800" />
                                        </div>
                                        <h3 className="ml-3 text-lg font-semibold text-green-900">Informasi Keluarga</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-white/70 p-4">
                                            <label className="text-sm font-medium text-green-600">Nama Keluarga</label>
                                            <p className="mt-1 text-sm font-semibold text-green-900">{citizen.family.family_name}</p>
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                onClick={() => {
                                                    if (citizen.family) {
                                                        router.visit(`/families/${citizen.family.id}`);
                                                    }
                                                }}
                                                className="inline-flex items-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg"
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                Lihat Detail Keluarga
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
};

export default DetailCitizen;
