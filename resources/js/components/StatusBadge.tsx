interface StatusBadgeProps {
    type: 'status' | 'eventType';
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

    const config =
        type === 'status'
            ? statusConfig[value as keyof typeof statusConfig] || statusConfig.pending
            : typeConfig[value as keyof typeof typeConfig] || typeConfig.public;

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className} ${className}`}>
            {config.label}
        </span>
    );
}
