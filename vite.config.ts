import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    // base: '/desa-terpadu/build/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            host: 'localhost',
            protocol: 'http',
            port: 5173,
        },
    },
    // server: {
    //     host: '192.168.254.198', // Ganti dari 'localhost' ke '0.0.0.0'
    //     port: 5173,
    //     strictPort: true,
    //     cors: true,
    //     hmr: {
    //         host: '192.168.254.198', // Ganti dari 'localhost' ke '0.0.0.0'
    //         protocol: 'http',
    //         port: 5173,
    //     },
    // },
});
