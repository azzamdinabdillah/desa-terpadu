import type { Paginated, PaginationLink } from '@/components/Pagination';
interface User {
    id: number;
    name: string;
    email: string;
}

interface Finance {
    id: number;
    date: string;
    type: 'income' | 'expense';
    amount: number;
    note: string;
    user: User;
    user_id: number;
    proof_image: string;
    created_at: string;
    remaining_balance: number;
}

type PaginatedFinances = Paginated<Finance>;

interface Summary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

interface Filters {
    search: string;
    type: string;
}

interface Props {
    finances: PaginatedFinances;
    summary: Summary;
    filters: Filters;
}

export type { Filters, Finance, PaginatedFinances, PaginationLink, Props, Summary, User };
