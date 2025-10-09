export interface User {
    id: number;
    email: string;
    role?: 'admin' | 'superadmin' | 'citizen';
    status?: 'active' | 'inactive' | string;
    citizen?: {
        id: number;
        full_name: string;
        nik: string;
    };
}
