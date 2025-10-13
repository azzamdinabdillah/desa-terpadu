import type { Paginated } from '@/components/Pagination';
import type { CitizenType } from '../citizen/citizenType';
import { FamilyType } from '../familyType';

export interface SocialAidProgram {
    id: number;
    program_name: string;
    period: string;
    image?: string | null;
    type: 'individual' | 'household' | 'public';
    status: 'pending' | 'ongoing' | 'completed';
    date_start: string;
    date_end: string;
    quota: number;
    description?: string | null;
    location: string;
    created_at: string;
    updated_at: string;
    recipients_count?: number;
    collected_count?: number;
    not_collected_count?: number;
    created_by?: {
        citizen: CitizenType;
    };
}

export interface SocialAidRecipient {
    id: number;
    program_id: number;
    citizen_id?: number | null;
    family_id?: number | null;
    status: 'collected' | 'not_collected';
    collected_at?: string | null;
    note?: string | null;
    image_proof?: string | null;
    created_at: string;
    updated_at: string;
    program?: SocialAidProgram;
    citizen?: CitizenType | null;
    family?: FamilyType | null;
    performed_by?: {
        citizen: CitizenType;
    } | null;
}

export interface SocialAidSummary {
    total_programs: number;
    total_individual: number;
    total_household: number;
    total_public: number;
}

export type PaginatedSocialAidPrograms = Paginated<SocialAidProgram>;
export type PaginatedSocialAidRecipients = Paginated<SocialAidRecipient>;
