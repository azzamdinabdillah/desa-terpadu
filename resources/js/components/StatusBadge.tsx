interface StatusBadgeProps {
    type: 'status' | 'eventType' | 'assetCondition' | 'assetStatus' | 'loanStatus';
    value: string;
    className?: string;
}

export default function StatusBadge({ type, value, className = '' }: StatusBadgeProps) {
    const statusConfig = {
        pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
        ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-800' },
        finished: { label: 'Selesai', className: 'bg-gray-100 text-gray-800' },
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
        default:
            config = { label: value, className: 'bg-gray-100 text-gray-800' };
    }

    return (
        <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className} ${className}`}>
            {config.label}
        </span>
    );
}
