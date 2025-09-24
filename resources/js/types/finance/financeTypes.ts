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
    proof_image: string;
    created_at: string;
    remaining_balance: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedFinances {
    data: Finance[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

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
