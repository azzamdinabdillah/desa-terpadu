export interface User {
    id: number;
    email: string;
    role?: 'admin' | 'superadmin' | 'citizen';
    status?: 'active' | 'inactive' | string;
    citizen?: {
        full_name: string;
    };
}
