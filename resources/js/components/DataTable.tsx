import { ReactNode } from 'react';

export interface Column<T> {
    key: string;
    header: ReactNode;
    className?: string;
    cell: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    tableClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    wrapperClassName?: string;
    emptyMessage?: ReactNode;
}

export default function DataTable<T>({
    columns,
    data,
    tableClassName,
    theadClassName,
    tbodyClassName,
    wrapperClassName,
    emptyMessage,
}: DataTableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <div className={`rounded-lg border border-green-200 bg-white p-12 text-center shadow-lg ${wrapperClassName || ''}`}>
                {emptyMessage || <span className="text-green-700">Tidak ada data</span>}
            </div>
        );
    }

    return (
        <div className={`overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg ${wrapperClassName || ''}`}>
            <div className="overflow-x-auto">
                <table className={`min-w-full divide-y divide-green-200 ${tableClassName || ''}`}>
                    <thead className={theadClassName || 'bg-green-100'}>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`whitespace-nowrap px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tbodyClassName || 'divide-y divide-green-100 bg-white'}>
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-green-50">
                                {columns.map((col) => (
                                    <td key={col.key} className={`whitespace-nowrap px-6 py-4 ${col.className || ''}`}>
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
