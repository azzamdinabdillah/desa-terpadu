export interface Asset {
    id: number;
    code: string;
    asset_name: string;
    condition: 'good' | 'fair' | 'bad';
    status: 'idle' | 'onloan';
    notes?: string;
    image?: string;
    created_at: string;
    updated_at: string;
}
