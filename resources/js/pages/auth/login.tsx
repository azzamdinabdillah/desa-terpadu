import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();

    useEffect(() => {
        if (props?.flash?.success) {
            setAlert({ type: 'success', message: props.flash.success });
        } else if (props?.flash?.error) {
            setAlert({ type: 'error', message: props.flash.error });
        }
    }, [props?.flash?.success, props?.flash?.error]);

    // Show all validation errors in an alert as well (mirror finance create pattern)
    useEffect(() => {
        const entries = Object.entries(errors || {});
        if (entries.length) {
            setAlert({
                type: 'error',
                message: (
                    <div>
                        <div className="mb-1 font-semibold">Terjadi kesalahan validasi:</div>
                        <ul className="list-inside list-disc text-sm text-red-800">
                            {entries.map(([field, msgs]) =>
                                Array.isArray(msgs) ? msgs.map((msg, idx) => <li key={field + idx}>{msg}</li>) : <li key={field}>{msgs as any}</li>,
                            )}
                        </ul>
                    </div>
                ),
            });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onError: () => {
                setData('password', '');
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
            <div className="w-full max-w-md">
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
                        <span className="text-xl">🌾</span>
                    </div>
                    <h1 className="text-2xl font-bold text-green-900">Masuk ke Desa Terpadu</h1>
                    <p className="mt-1 text-sm text-green-700">Silakan masuk untuk melanjutkan</p>
                </div>

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="nama@desa.id"
                            value={data.email}
                            onChange={(v) => setData('email', v)}
                            required
                            error={errors.email}
                        />
                        <InputField
                            label="Kata Sandi"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(v) => setData('password', v)}
                            required
                            error={errors.password}
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

                        <Button type="submit" fullWidth disabled={processing}>
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
