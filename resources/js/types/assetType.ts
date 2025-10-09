import { CitizenType } from './citizen/citizenType';

export interface Asset {
    id: number;
    code: string;
    asset_name: string;
    borrower_id?: number;
    condition: 'good' | 'fair' | 'bad';
    status: 'idle' | 'onloan';
    notes?: string;
    image?: string;
    created_at: string;
    updated_at: string;
    borrower?: CitizenType;
}
