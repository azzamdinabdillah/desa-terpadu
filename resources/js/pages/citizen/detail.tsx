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

                    <div className="space-y-6">
                        {/* Profile Overview Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                                <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-green-200 bg-green-50 md:mb-0">
                                    {citizen.profile_picture ? (
                                        <img
                                            src={`/storage/${citizen.profile_picture}`}
                                            alt={citizen.full_name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-12 w-12 text-green-600" />
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="mb-2 text-2xl font-bold text-green-900">{citizen.full_name}</h2>
                                    <div className="mb-4">
                                        <StatusBadge status={citizen.status || ''} />
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                                        <div className="flex items-center text-sm text-green-700">
                                            <Calendar className="mr-2 h-4 w-4 text-green-600" />
                                            <span>{calculateAge(citizen.date_of_birth || '')} tahun</span>
                                        </div>
                                        <div className="flex items-center text-sm text-green-700">
                                            <User className="mr-2 h-4 w-4 text-green-600" />
                                            <span>{getGenderLabel(citizen.gender || '')}</span>
                                        </div>
                                        {citizen.phone_number && (
                                            <div className="flex items-center text-sm text-green-700">
                                                <Phone className="mr-2 h-4 w-4 text-green-600" />
                                                <span>{citizen.phone_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Personal Information */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <User className="mr-2 h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-green-900">Informasi Pribadi</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-600">NIK</label>
                                        <p className="mt-1 text-sm text-green-900">{citizen.nik}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-600">Tanggal Lahir</label>
                                        <p className="mt-1 text-sm text-green-900">{formatDate(citizen.date_of_birth || '')}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-600">Agama</label>
                                        <p className="mt-1 text-sm text-green-900">{getReligionLabel(citizen.religion || '')}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-600">Status Pernikahan</label>
                                        <p className="mt-1 text-sm text-green-900">{getMaritalStatusLabel(citizen.marital_status || '')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <MapPin className="mr-2 h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-green-900">Informasi Alamat</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-600">Alamat</label>
                                    <p className="mt-1 text-sm leading-relaxed text-green-900">{citizen.address}</p>
                                </div>
                            </div>

                            {/* Work Information */}
                            <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <Briefcase className="mr-2 h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-green-900">Informasi Pekerjaan</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-600">Pekerjaan</label>
                                        <p className="mt-1 text-sm text-green-900">{citizen.occupation}</p>
                                    </div>
                                    {citizen.position && (
                                        <div>
                                            <label className="block text-sm font-medium text-green-600">Jabatan</label>
                                            <p className="mt-1 text-sm text-green-900">{citizen.position}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Family Information */}
                            {citizen.family && (
                                <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex items-center">
                                        <Users className="mr-2 h-5 w-5 text-green-600" />
                                        <h3 className="text-lg font-semibold text-green-900">Informasi Keluarga</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-green-600">Nama Keluarga</label>
                                            <p className="mt-1 text-sm text-green-900">{citizen.family.family_name}</p>
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                onClick={() => {
                                                    if (citizen.family) {
                                                        router.visit(`/families/${citizen.family.id}`);
                                                    }
                                                }}
                                                className="inline-flex items-center rounded-md border border-green-300 bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
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
