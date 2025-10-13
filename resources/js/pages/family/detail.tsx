import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { calculateAge, formatDate, getGenderLabel, getStatusLabel } from '@/lib/utils';
import { CitizenType } from '@/types/citizen/citizenType';
import { FamilyType } from '@/types/familyType';
import { Head } from '@inertiajs/react';
import { Baby, Briefcase, Calendar, CreditCard, Heart, Home, MapPin, Phone, User, Users } from 'lucide-react';

interface FamilyDetailProps {
    family: FamilyType;
    headOfHousehold: CitizenType | null;
    spouses: CitizenType[];
    children: CitizenType[];
}

export default function FamilyDetail({ family, headOfHousehold, spouses, children }: FamilyDetailProps) {
    const { isAdmin } = useAuth();
    const totalMembers = (headOfHousehold ? 1 : 0) + spouses.length + children.length;

    return (
        <BaseLayouts>
            <Head title={`Detail Keluarga ${family.family_name}`} />

            <div>
                <Header showBackButton title="Detail Keluarga" icon="🏠" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title={family.family_name} description={`Detail informasi keluarga ${family.family_name}`} total={totalMembers} />

                    {/* Family Info Card */}
                    <div className="mb-8">
                        <DetailCard title={family.family_name} icon={Home}>
                            <div className="space-y-3">
                                {isAdmin && <DetailItem icon={Users} label="No. KK" value={family.kk_number} />}
                                <DetailItem icon={Calendar} label="Dibuat" value={formatDate(family.created_at || '')} />
                                <DetailItem icon={Users} label="Total Anggota" value={`${totalMembers} orang`} withBorder={false} />
                            </div>
                        </DetailCard>
                    </div>

                    {/* Head of Household Section */}
                    {headOfHousehold && (
                        <div className="mb-8">
                            <DetailCard title={`Kepala Keluarga - ${headOfHousehold.full_name}`} icon={User}>
                                <div className="mb-4 text-sm text-gray-600">
                                    Status: <span className="font-medium text-gray-900">{getStatusLabel(headOfHousehold.status || '')}</span>
                                </div>
                                <div className="space-y-3">
                                    {isAdmin && <DetailItem icon={CreditCard} label="NIK" value={headOfHousehold.nik} />}
                                    <DetailItem icon={User} label="Jenis Kelamin" value={getGenderLabel(headOfHousehold.gender || '')} />
                                    <DetailItem
                                        icon={Calendar}
                                        label="Tanggal Lahir"
                                        value={`${formatDate(headOfHousehold.date_of_birth || '')} (${calculateAge(headOfHousehold.date_of_birth || '')} tahun)`}
                                    />
                                    <DetailItem
                                        icon={Briefcase}
                                        label="Pekerjaan"
                                        value={headOfHousehold.occupation || '-'}
                                        withBorder={!!(headOfHousehold.phone_number || headOfHousehold.religion)}
                                    />
                                    {headOfHousehold.phone_number && (
                                        <DetailItem
                                            icon={Phone}
                                            label="Telepon"
                                            value={headOfHousehold.phone_number}
                                            withBorder={!!headOfHousehold.religion}
                                        />
                                    )}
                                    {headOfHousehold.religion && (
                                        <DetailItem icon={Heart} label="Agama" value={headOfHousehold.religion} withBorder={false} />
                                    )}
                                </div>
                            </DetailCard>
                        </div>
                    )}

                    {/* Spouses Section */}
                    {spouses.length > 0 && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Pasangan ({spouses.length} orang)</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {spouses.map((spouse) => (
                                    <DetailCard key={spouse.id} title={spouse.full_name} icon={User}>
                                        <div className="mb-4 text-sm text-gray-600">
                                            Status: <span className="font-medium text-gray-900">{getStatusLabel(spouse.status || '')}</span>
                                        </div>
                                        <div className="space-y-3">
                                            {isAdmin && <DetailItem icon={CreditCard} label="NIK" value={spouse.nik} />}
                                            <DetailItem icon={User} label="Jenis Kelamin" value={getGenderLabel(spouse.gender || '')} />
                                            <DetailItem
                                                icon={Calendar}
                                                label="Tanggal Lahir"
                                                value={`${formatDate(spouse.date_of_birth || '')} (${calculateAge(spouse.date_of_birth || '')} tahun)`}
                                            />
                                            <DetailItem
                                                icon={Briefcase}
                                                label="Pekerjaan"
                                                value={spouse.occupation || '-'}
                                                withBorder={!!(spouse.phone_number || spouse.religion)}
                                            />
                                            {spouse.phone_number && (
                                                <DetailItem icon={Phone} label="Telepon" value={spouse.phone_number} withBorder={!!spouse.religion} />
                                            )}
                                            {spouse.religion && <DetailItem icon={Heart} label="Agama" value={spouse.religion} withBorder={false} />}
                                        </div>
                                    </DetailCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Children Section */}
                    {children && children.length > 0 && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Anak-anak ({children.length} orang)</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {children.map((child) => (
                                    <DetailCard key={child.id} title={child.full_name} icon={Baby}>
                                        <div className="mb-4 text-sm text-gray-600">
                                            Status: <span className="font-medium text-gray-900">{getStatusLabel(child.status || '')}</span>
                                        </div>
                                        <div className="space-y-3">
                                            {isAdmin && <DetailItem icon={CreditCard} label="NIK" value={child.nik} />}
                                            <DetailItem icon={User} label="Jenis Kelamin" value={getGenderLabel(child.gender || '')} />
                                            <DetailItem
                                                icon={Calendar}
                                                label="Tanggal Lahir"
                                                value={`${formatDate(child.date_of_birth || '')} (${calculateAge(child.date_of_birth || '')} tahun)`}
                                            />
                                            <DetailItem
                                                icon={Briefcase}
                                                label="Pekerjaan"
                                                value={child.occupation || '-'}
                                                withBorder={!!(child.phone_number || child.religion)}
                                            />
                                            {child.phone_number && (
                                                <DetailItem icon={Phone} label="Telepon" value={child.phone_number} withBorder={!!child.religion} />
                                            )}
                                            {child.religion && <DetailItem icon={Heart} label="Agama" value={child.religion} withBorder={false} />}
                                        </div>
                                    </DetailCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No family members message */}
                    {!headOfHousehold && spouses.length === 0 && children.length === 0 && (
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
