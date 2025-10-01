import { Asset } from "./assetType";
import { CitizenType } from "./citizen/citizenType";

export interface AssetLoan {
    id: number;
    asset_id: number;
    citizen_id: number;
    status: 'waiting_approval' | 'rejected' | 'on_loan' | 'returned';
    reason: string;
    note?: string;
    image_before_loan?: string;
    image_after_loan?: string;
    borrowed_at?: string;
    expected_return_date?: string;
    returned_at?: string;
    created_at: string;
    updated_at: string;
    asset: Asset;
    citizen: CitizenType;
}