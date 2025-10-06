export interface MasterDocument {
    id: number;
    document_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface MasterDocumentPageProps {
    masterDocuments: {
        data: MasterDocument[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}
