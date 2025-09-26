import { FamilyType } from "../familyType";

export interface CitizenType {
    id: number;
    full_name: string;
    nik: string;
    phone_number?: string;
    address?: string;
    gender?: string;
    date_of_birth?: string;
    occupation?: string;
    position: string;
    status?: string;
    profile_picture?: string | null;
    religion?: string;
    marital_status?: string;
    family_id: number;
    family: FamilyType;
}