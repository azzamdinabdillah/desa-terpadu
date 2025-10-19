import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { calculateAge, formatDate, getGenderLabel, getMaritalStatusLabel, getReligionLabel } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { Head, router } from '@inertiajs/react';
import { Briefcase, Calendar, CreditCard, Heart, Home, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import React from 'react';

interface Props {
    citizen: CitizenType;
}

const DetailCitizen: React.FC<Props> = ({ citizen }) => {
    const { isAdmin } = useAuth();
    return (
        <BaseLayouts>
            <Head title={`Detail Warga - ${citizen.full_name}`} />

            <div>
                <Header showBackButton title="Detail Data Warga" icon="👤" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Detail Warga" description="Detail data warga" />

                    <div className="space-y-6">
                        {/* Profile Overview Card */}
                        <DetailCard title="Profil Warga" icon={User}>
                            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                                <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-green-200 bg-green-50 shadow-sm md:mb-0">
                                    {citizen.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_APP_URL}/storage/${citizen.profile_picture}`}
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
                                        <StatusBadge type="citizenStatus" value={citizen.status || ''} />
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                            <span className="font-medium text-gray-700">{calculateAge(citizen.date_of_birth || '')} tahun</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                                            <User className="h-4 w-4 text-green-600" />
                                            <span className="font-medium text-gray-700">{getGenderLabel(citizen.gender || '')}</span>
                                        </div>
                                        {citizen.email && (
                                            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                                                <Mail className="h-4 w-4 text-green-600" />
                                                <span className="font-medium text-gray-700">{citizen.email}</span>
                                            </div>
                                        )}
                                        {citizen.phone_number && (
                                            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                                                <Phone className="h-4 w-4 text-green-600" />
                                                <span className="font-medium text-gray-700">{citizen.phone_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DetailCard>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Personal Information */}
                            <DetailCard title="Informasi Pribadi" icon={User}>
                                <div className="space-y-3">
                                    {isAdmin && <DetailItem icon={CreditCard} label="NIK" value={citizen.nik} />}
                                    <DetailItem icon={Calendar} label="Tanggal Lahir" value={formatDate(citizen.date_of_birth || '')} />
                                    {citizen.email && <DetailItem icon={Mail} label="Email" value={citizen.email} />}
                                    {citizen.phone_number && <DetailItem icon={Phone} label="Nomor Telepon" value={citizen.phone_number} />}
                                    <DetailItem icon={Heart} label="Agama" value={getReligionLabel(citizen.religion || '')} />
                                    <DetailItem
                                        icon={Users}
                                        label="Status Pernikahan"
                                        value={getMaritalStatusLabel(citizen.marital_status || '')}
                                        withBorder={false}
                                    />
                                </div>
                            </DetailCard>

                            {/* Address Information */}
                            <DetailCard title="Informasi Alamat" icon={MapPin}>
                                <DetailItem
                                    icon={MapPin}
                                    label="Alamat Lengkap"
                                    value={<p className="mt-1 text-sm leading-relaxed text-gray-900">{citizen.address}</p>}
                                    withBorder={false}
                                />
                            </DetailCard>

                            {/* Work Information */}
                            <DetailCard title="Informasi Pekerjaan" icon={Briefcase}>
                                <div className="space-y-3">
                                    <DetailItem icon={Briefcase} label="Pekerjaan" value={citizen.occupation} withBorder={!!citizen.position} />
                                    {citizen.position && <DetailItem icon={User} label="Jabatan" value={citizen.position} withBorder={false} />}
                                </div>
                            </DetailCard>

                            {/* Family Information */}
                            {citizen.family && (
                                <DetailCard title="Informasi Keluarga" icon={Users}>
                                    <div className="space-y-4">
                                        <DetailItem icon={Home} label="Nama Keluarga" value={citizen.family.family_name} withBorder={false} />
                                        <button
                                            onClick={() => {
                                                if (citizen.family) {
                                                    router.visit(`${import.meta.env.VITE_APP_SUB_URL}/families/${citizen.family.id}`);
                                                }
                                            }}
                                            className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                        >
                                            <Home className="mr-2 h-4 w-4" />
                                            Lihat Detail Keluarga
                                        </button>
                                    </div>
                                </DetailCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
};

export default DetailCitizen;
