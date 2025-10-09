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
                    <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                <UserCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h2 className="ml-3 text-xl font-semibold text-gray-900">Informasi Akun</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">ID Pengguna</label>
                                <div className="flex items-center text-gray-900">
                                    <CreditCard className="mr-2 h-4 w-4 text-gray-400" />#{user.id}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <div className="flex items-center text-gray-900">
                                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Terdaftar Sejak</label>
                                <div className="flex items-center text-gray-900">
                                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                    {formatDate(user.created_at, false, false)}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Terakhir Diperbarui</label>
                                <div className="flex items-center text-gray-900">
                                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                    {formatDate(user.updated_at, false, false)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {user.citizen && (
                        <>
                            {/* Personal Information */}
                            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                        <UserIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="ml-3 text-xl font-semibold text-gray-900">Informasi Pribadi</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">NIK</label>
                                        <div className="flex items-center text-gray-900">
                                            <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.nik}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                                        <div className="flex items-center text-gray-900">
                                            <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.full_name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                                        <div className="flex items-center text-gray-900">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.date_of_birth
                                                ? `${formatDate(user.citizen.date_of_birth, false, false)} (${calculateAge(user.citizen.date_of_birth)} tahun)`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                                        <div className="flex items-center text-gray-900">
                                            <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.gender ? getGenderLabel(user.citizen.gender) : '-'}
                                        </div>
                                    </div>
                                    {user.citizen.phone_number && (
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                                            <div className="flex items-center text-gray-900">
                                                <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                                {user.citizen.phone_number}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Agama</label>
                                        <div className="flex items-center text-gray-900">
                                            <Heart className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.religion ? getReligionLabel(user.citizen.religion) : '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Status Pernikahan</label>
                                        <div className="flex items-center text-gray-900">
                                            <Heart className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.marital_status ? getMaritalStatusLabel(user.citizen.marital_status) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                                        <Briefcase className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h2 className="ml-3 text-xl font-semibold text-gray-900">Informasi Pekerjaan</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Pekerjaan</label>
                                        <div className="flex items-center text-gray-900">
                                            <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.occupation || '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Jabatan</label>
                                        <div className="flex items-center text-gray-900">
                                            <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                                            {user.citizen.position || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h2 className="ml-3 text-xl font-semibold text-gray-900">Informasi Alamat</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Alamat Lengkap</label>
                                        <div className="flex items-start text-gray-900">
                                            <MapPin className="mt-1 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                            <span>{user.citizen.address || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Family Information */}
                            {user.citizen.family && (
                                <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                                            <Users className="h-6 w-6 text-pink-600" />
                                        </div>
                                        <h2 className="ml-3 text-xl font-semibold text-gray-900">Informasi Keluarga</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Nomor Kartu Keluarga</label>
                                            <div className="flex items-center text-gray-900">
                                                <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                                                {user.citizen.family.kk_number || '-'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Status dalam Keluarga</label>
                                            <div className="flex items-center text-gray-900">
                                                <Users className="mr-2 h-4 w-4 text-gray-400" />
                                                {user.citizen.status ? getStatusLabel(user.citizen.status) : '-'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Nama Keluarga</label>
                                            <div className="flex items-center text-gray-900">
                                                <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                {user.citizen.family.family_name || '-'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Alamat Keluarga</label>
                                            <div className="flex items-start text-gray-900">
                                                <Home className="mt-1 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                <span>{user.citizen.family.address || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
