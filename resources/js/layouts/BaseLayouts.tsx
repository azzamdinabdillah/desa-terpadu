import Sidebar from '@/components/Sidebar';

export function BaseLayouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-green-50">
            <Sidebar />
            <div className="lg:ml-64">{children}</div>
        </div>
    );
}
