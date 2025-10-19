interface StatusBadgeProps {
    type:
        | 'status'
        | 'eventType'
        | 'assetCondition'
        | 'assetStatus'
        | 'loanStatus'
        | 'socialAidType'
        | 'socialAidStatus'
        | 'documentStatus'
        | 'userRole'
        | 'userStatus'
        | 'citizenStatus';
    value: string;
    className?: string;
}

export default function StatusBadge({ type, value, className = '' }: StatusBadgeProps) {
    const statusConfig = {
        pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
        ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-800' },
        finished: { label: 'Selesai', className: 'bg-gray-100 text-gray-800' },
        collected: { label: 'Sudah Diambil', className: 'bg-green-100 text-green-800' },
        not_collected: { label: 'Belum Diambil', className: 'bg-gray-100 text-gray-800' },
    };

    const typeConfig = {
        public: { label: 'Umum', className: 'bg-blue-100 text-blue-800' },
        restricted: { label: 'Terbatas', className: 'bg-red-100 text-red-800' },
    };

    const assetConditionConfig = {
        good: { label: 'Baik', className: 'bg-green-100 text-green-800' },
        fair: { label: 'Cukup', className: 'bg-yellow-100 text-yellow-800' },
        bad: { label: 'Buruk', className: 'bg-red-100 text-red-800' },
    };

    const assetStatusConfig = {
        idle: { label: 'Tersedia', className: 'bg-green-100 text-green-800' },
        onloan: { label: 'Dipinjam', className: 'bg-orange-100 text-orange-800' },
    };

    const loanStatusConfig = {
        waiting_approval: { label: 'Menunggu Persetujuan', className: 'bg-yellow-100 text-yellow-800' },
        on_loan: { label: 'Sedang Dipinjam', className: 'bg-green-100 text-green-800' },
        returned: { label: 'Dikembalikan', className: 'bg-gray-100 text-gray-800' },
        rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
    };

    const socialAidTypeConfig = {
        individual: { label: 'Individu', className: 'bg-blue-100 text-blue-800' },
        household: { label: 'Keluarga', className: 'bg-green-100 text-green-800' },
        public: { label: 'Publik', className: 'bg-purple-100 text-purple-800' },
    };

    const socialAidStatusConfig = {
        pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
        ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-800' },
        completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-800' },
    };

    const documentStatusConfig = {
        pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
        on_proccess: { label: 'Diproses', className: 'bg-blue-100 text-blue-800' },
        completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
        rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
    };

    const userRoleConfig = {
        superadmin: { label: 'Super Admin', className: 'bg-purple-100 text-purple-800 border border-purple-200' },
        admin: { label: 'Admin', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
        citizen: { label: 'Warga', className: 'bg-green-100 text-green-800 border border-green-200' },
    };

    const userStatusConfig = {
        active: { label: 'Aktif', className: 'bg-green-100 text-green-800' },
        inactive: { label: 'Tidak Aktif', className: 'bg-red-100 text-red-800' },
    };

    const citizenStatusConfig = {
        child: { label: 'Anak', className: 'bg-blue-100 text-blue-800' },
        spouse: { label: 'Pasangan', className: 'bg-purple-100 text-purple-800' },
        head_of_household: { label: 'Kepala Keluarga', className: 'bg-green-100 text-green-800' },
    };

    let config;
    switch (type) {
        case 'status':
            config = statusConfig[value as keyof typeof statusConfig] || statusConfig.pending;
            break;
        case 'eventType':
            config = typeConfig[value as keyof typeof typeConfig] || typeConfig.public;
            break;
        case 'assetCondition':
            config = assetConditionConfig[value as keyof typeof assetConditionConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'assetStatus':
            config = assetStatusConfig[value as keyof typeof assetStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'loanStatus':
            config = loanStatusConfig[value as keyof typeof loanStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'socialAidType':
            config = socialAidTypeConfig[value as keyof typeof socialAidTypeConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'socialAidStatus':
            config = socialAidStatusConfig[value as keyof typeof socialAidStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'documentStatus':
            config = documentStatusConfig[value as keyof typeof documentStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'userRole':
            config = userRoleConfig[value as keyof typeof userRoleConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'userStatus':
            config = userStatusConfig[value as keyof typeof userStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        case 'citizenStatus':
            config = citizenStatusConfig[value as keyof typeof citizenStatusConfig] || { label: value, className: 'bg-gray-100 text-gray-800' };
            break;
        default:
            config = { label: value, className: 'bg-gray-100 text-gray-800' };
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${config.className} ${className}`}
        >
            {config.label}
        </span>
    );
}
