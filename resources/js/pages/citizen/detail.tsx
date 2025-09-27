import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { calculateAge, formatDate, getGenderLabel, getMaritalStatusLabel, getReligionLabel } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { Head, router } from '@inertiajs/react';
import { Briefcase, Calendar, Home, MapPin, Phone, User, Users } from 'lucide-react';
import React from 'react';

interface Props {
    citizen: CitizenType;
}

const DetailCitizen: React.FC<Props> = ({ citizen }) => {
    return (
        <BaseLayouts>
            <Head title={`Detail Warga - ${citizen.full_name}`} />

            <div>
                <Header showBackButton title="Detail Data Warga" icon="👤" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Detail Warga" description="Detail data warga" />

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
                                    <StatusBadge status={citizen.status || ''} />
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center rounded-lg bg-white/70 p-2 text-sm text-green-700">
                                        <Calendar className="mr-2 h-4 w-4 text-green-600" />
                                        <span>{calculateAge(citizen.date_of_birth || '')} tahun</span>
                                    </div>
                                    <div className="flex items-center rounded-lg bg-white/70 p-2 text-sm text-green-700">
                                        <User className="mr-2 h-4 w-4 text-green-600" />
                                        <span>{getGenderLabel(citizen.gender || '')}</span>
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
                                        <p className="mt-1 text-sm font-semibold text-green-900">{formatDate(citizen.date_of_birth || '')}</p>
                                    </div>
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Agama</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">{getReligionLabel(citizen.religion || '')}</p>
                                    </div>
                                    <div className="rounded-lg bg-white/70 p-4">
                                        <label className="text-sm font-medium text-green-600">Status Pernikahan</label>
                                        <p className="mt-1 text-sm font-semibold text-green-900">
                                            {getMaritalStatusLabel(citizen.marital_status || '')}
                                        </p>
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
