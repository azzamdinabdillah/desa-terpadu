import type { User } from '@/types/user/userTypes';
import { usePage } from '@inertiajs/react';

export type Role = 'admin' | 'superadmin' | 'citizen';

export function isAdmin(user?: User | null): boolean {
    return (user?.role ?? '') === 'admin';
}

export function isSuperAdmin(user?: User | null): boolean {
    return (user?.role ?? '') === 'superadmin';
}

export function isCitizen(user?: User | null): boolean {
    return (user?.role ?? '') === 'citizen';
}

export function hasRole(user: User | null | undefined, roles: Role | Role[]): boolean {
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes((user?.role as Role) ?? ('' as Role));
}

export function useAuth() {
    const { auth } = usePage<{ auth?: { user?: User | null } }>().props;
    const user = auth?.user ?? null;
    return {
        auth,
        user,
        isAuthenticated: Boolean(user),
        isAdmin: isAdmin(user),
        isSuperAdmin: isSuperAdmin(user),
        isCitizen: isCitizen(user),
        hasRole: (roles: Role | Role[]) => hasRole(user, roles),
    } as const;
}
