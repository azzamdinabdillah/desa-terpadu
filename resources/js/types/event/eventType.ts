import { CitizenType } from '../citizen/citizenType';

export interface EventType {
    id: number;
    event_name: string;
    description?: string;
    date_start: string;
    date_end: string;
    location: string;
    flyer?: string | null;
    status: 'pending' | 'ongoing' | 'finished';
    type: 'public' | 'restricted';
    max_participants?: number | null;
    created_by: {
        citizen: CitizenType;
    };
    created_at: string;
    updated_at: string;
    createdBy?: {
        citizen: CitizenType;
    };
    participants?: Array<{
        id: number;
        citizen: CitizenType;
        created_at: string;
    }>;
    documentations?: EventsDocumentationType[];
}

export interface EventsDocumentationType {
    id: number;
    event_id: number;
    caption: string;
    path: string;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
}

export interface EventParticipantType {
    id: number;
    event_id: number;
    citizen_id: number;
    created_at: string;
    updated_at: string;
    citizen?: CitizenType;
}
