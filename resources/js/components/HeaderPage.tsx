interface HeaderPageProps {
    title: string;
    description?: string;
    search?: string | null;
    total?: number;
}

function HeaderPage({ title, description, search, total }: HeaderPageProps) {
    const hasSearch = typeof search === 'string' && search.trim().length > 0;

    return (
        <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-green-900">{title}</h1>
            {description && (
                <p className="mt-2 text-green-700">
                    {description}
                    {hasSearch && (
                        <span className="ml-2 text-sm">
                            - Menampilkan {total ?? 0} hasil dari pencarian "{search}"
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}

export default HeaderPage;
