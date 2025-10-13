import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { calculateAge, formatDate, getGenderLabel, getMaritalStatusLabel, getReligionLabel, getStatusLabel } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { User } from '@/types/user/userTypes';
import { Head, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Calendar,
    Clock,
    CreditCard,
    Heart,
    Home,
    Mail,
    MapPin,
    Phone,
    UserCircle,
    User as UserIcon,
    Users,
} from 'lucide-react';
import React from 'react';

interface UserProfile extends User {
    created_at: string;
    updated_at: string;
    citizen?: CitizenType;
}

interface ProfilePageProps {
    user: UserProfile;
    [key: string]: unknown;
}

const Profile: React.FC = () => {
    const { user } = usePage<ProfilePageProps>().props;

    const getDefaultAvatar = () => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.citizen?.full_name || 'User')}&background=10b981&color=fff&size=200`;
    };

    return (
        <BaseLayouts>
            <Head title="Profile Saya" />
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <HeaderPage title="Profile Saya" description="Informasi lengkap tentang akun dan data diri Anda" />

                <div className="mt-8 space-y-6">
                    {/* Profile Header Card */}
                    <div className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
                        {/* <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600"></div> */}
                        <div className="px-6 py-6">
                            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
                                <div className="relative">
                                    {user.citizen?.profile_picture ? (
                                        <img
                                            src={`/storage/${user.citizen.profile_picture}`}
                                            alt={user.citizen.full_name}
                                            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                        />
                                    ) : (
                                        <img
                                            src={getDefaultAvatar()}
                                            alt={user.citizen?.full_name || 'User'}
                                            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                        />
                                    )}
                                    <div
                                        className={`absolute right-2 bottom-2 h-6 w-6 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                                    ></div>
                                </div>
                                <div className="flex-1 text-center sm:mt-0 sm:text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        {user.citizen?.full_name || 'Nama Tidak Tersedia'}
                                    </h1>
                                    <p className="mt-1 text-gray-600">
                                        {user.citizen?.occupation || 'Pekerjaan tidak tersedia'}
                                        {user.citizen?.position && ` - ${user.citizen.position}`}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                        <StatusBadge type="userRole" value={user.role || 'citizen'} />
                                        {user.status && <StatusBadge type="userStatus" value={user.status} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <DetailCard title="Informasi Akun" icon={UserCircle}>
                        <div className="space-y-4">
                            <DetailItem icon={CreditCard} label="ID Pengguna" value={`#${user.id}`} />
                            <DetailItem icon={Mail} label="Email" value={user.email} />
                            <DetailItem icon={Clock} label="Terdaftar Sejak" value={formatDate(user.created_at, false, false)} />
                            <DetailItem
                                icon={Clock}
                                label="Terakhir Diperbarui"
                                value={formatDate(user.updated_at, false, false)}
                                withBorder={false}
                            />
                        </div>
                    </DetailCard>

                    {user.citizen && (
                        <>
                            {/* Personal Information */}
                            <DetailCard title="Informasi Pribadi" icon={UserIcon}>
                                <div className="space-y-4">
                                    <DetailItem icon={CreditCard} label="NIK" value={user.citizen.nik} />
                                    <DetailItem icon={UserIcon} label="Nama Lengkap" value={user.citizen.full_name} />
                                    <DetailItem
                                        icon={Calendar}
                                        label="Tanggal Lahir"
                                        value={
                                            user.citizen.date_of_birth
                                                ? `${formatDate(user.citizen.date_of_birth, false, false)} (${calculateAge(user.citizen.date_of_birth)} tahun)`
                                                : '-'
                                        }
                                    />
                                    <DetailItem
                                        icon={UserIcon}
                                        label="Jenis Kelamin"
                                        value={user.citizen.gender ? getGenderLabel(user.citizen.gender) : '-'}
                                    />
                                    {user.citizen.phone_number && <DetailItem icon={Phone} label="Nomor Telepon" value={user.citizen.phone_number} />}
                                    <DetailItem
                                        icon={Heart}
                                        label="Agama"
                                        value={user.citizen.religion ? getReligionLabel(user.citizen.religion) : '-'}
                                    />
                                    <DetailItem
                                        icon={Heart}
                                        label="Status Pernikahan"
                                        value={user.citizen.marital_status ? getMaritalStatusLabel(user.citizen.marital_status) : '-'}
                                        withBorder={false}
                                    />
                                </div>
                            </DetailCard>

                            {/* Professional Information */}
                            <DetailCard title="Informasi Pekerjaan" icon={Briefcase}>
                                <div className="space-y-4">
                                    <DetailItem icon={Briefcase} label="Pekerjaan" value={user.citizen.occupation || '-'} />
                                    <DetailItem icon={Building2} label="Jabatan" value={user.citizen.position || '-'} withBorder={false} />
                                </div>
                            </DetailCard>

                            {/* Address Information */}
                            <DetailCard title="Informasi Alamat" icon={MapPin}>
                                <DetailItem icon={MapPin} label="Alamat Lengkap" value={user.citizen.address || '-'} withBorder={false} />
                            </DetailCard>

                            {/* Family Information */}
                            {user.citizen.family && (
                                <DetailCard title="Informasi Keluarga" icon={Users}>
                                    <div className="space-y-4">
                                        <DetailItem icon={CreditCard} label="Nomor Kartu Keluarga" value={user.citizen.family.kk_number || '-'} />
                                        <DetailItem
                                            icon={Users}
                                            label="Status dalam Keluarga"
                                            value={user.citizen.status ? getStatusLabel(user.citizen.status) : '-'}
                                        />
                                        <DetailItem icon={UserIcon} label="Nama Keluarga" value={user.citizen.family.family_name || '-'} />
                                        <DetailItem
                                            icon={Home}
                                            label="Alamat Keluarga"
                                            value={user.citizen.family.address || '-'}
                                            withBorder={false}
                                        />
                                    </div>
                                </DetailCard>
                            )}
                        </>
                    )}

                    {!user.citizen && (
                        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <UserIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Data Warga Tidak Tersedia</h3>
                                    <p className="mt-2 text-sm text-yellow-700">
                                        Akun Anda belum terhubung dengan data warga. Silakan hubungi administrator untuk informasi lebih lanjut.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayouts>
    );
};

export default Profile;
