import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // UI only for now
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
                        <span className="text-xl">🌾</span>
                    </div>
                    <h1 className="text-2xl font-bold text-green-900">Masuk ke Desa Terpadu</h1>
                    <p className="mt-1 text-sm text-green-700">Silakan masuk untuk melanjutkan</p>
                </div>

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Email" type="email" placeholder="nama@desa.id" value={email} onChange={setEmail} required />
                        <InputField
                            label="Kata Sandi"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={setPassword}
                            required
                            suffix={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="flex items-center gap-1 text-green-800"
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        <Button type="submit" fullWidth>
                            Masuk
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-green-700">Sistem Manajemen Desa Terpadu</p>
            </div>
        </div>
    );
}

export default Login;
