export interface User {
    id: number;
    email: string;
    citizen: {
        full_name: string;
    };
}