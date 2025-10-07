import type { Paginated } from '@/components/Pagination';
import { CitizenType } from '../citizen/citizenType';

export interface MasterDocumentType {
    id: number;
    document_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicationDocumentType {
    id: number;
    master_document_id: number;
    nik: string;
    status: 'pending' | 'on_proccess' | 'rejected' | 'completed';
    reason?: string;
    citizen_note?: string;
    admin_note?: string;
    file?: string;
    created_at: string;
    updated_at: string;
    master_document?: MasterDocumentType;
    citizen?: CitizenType;
}

export type PaginatedApplicationDocuments = Paginated<ApplicationDocumentType>;
