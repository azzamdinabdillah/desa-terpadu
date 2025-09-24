import Button from '@/components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
    prevUrl?: string;
    nextUrl?: string;
    links: PaginationLink[];
    onChange: (url: string) => void;
    className?: string;
}

export default function Pagination({ page, perPage, total, lastPage, prevUrl, nextUrl, links, onChange, className }: PaginationProps) {
    if (total === 0) return null;

    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    const cleanedLinks = links.filter((link) => {
        const labelNoTags = (link.label || '').replace(/<[^>]*>/g, '');
        const normalized = labelNoTags
            .replace(/&laquo;|&raquo;|«|»/g, '')
            .trim()
            .toLowerCase();
        return !['previous', 'next', 'sebelumnya', 'selanjutnya', 'berikutnya'].includes(normalized);
    });

    return (
        <div
            className={`mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-200 bg-white px-6 py-3 shadow-lg ${className || ''}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-sm text-green-700">
                    Menampilkan {start} sampai {end} dari {total} data
                </span>
            </div>
            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
                <Button
                    onClick={() => onChange(prevUrl || '')}
                    disabled={page === 1}
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<ChevronLeft className="h-4 w-4" />}
                >
                    <span className="block">Sebelumnya</span>
                </Button>

                <div className="flex gap-1">
                    {cleanedLinks.map((link, index) => (
                        <Button
                            key={index}
                            onClick={() => onChange(link.url || '')}
                            variant={link.active ? 'primary' : 'outline'}
                            size="sm"
                            className="h-8 w-8 rounded-lg text-sm"
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </div>

                <Button
                    onClick={() => onChange(nextUrl || '')}
                    disabled={page === lastPage}
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<ChevronRight className="h-4 w-4" />}
                    iconPosition="right"
                >
                    <span className="block">Selanjutnya</span>
                </Button>
            </div>
        </div>
    );
}
