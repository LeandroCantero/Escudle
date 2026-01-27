import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon/*'],
            manifest: {
                name: 'Escudle - Adivina el Escudo',
                short_name: 'Escudle',
                description: 'Adivina el escudo de fútbol oculto',
                theme_color: '#4ADE80',
                icons: [
                    {
                        src: 'favicon/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'favicon/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'favicon/maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp}'],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MiB
                // Caching strategy for external assets if needed
            }
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React core libraries
                    'react-vendor': ['react', 'react-dom'],
                    // Animation library (one of the biggest dependencies)
                    'framer-motion': ['framer-motion'],
                    // Search library
                    'fuse': ['fuse.js'],
                    // UI utilities
                    'ui-utils': ['clsx', 'tailwind-merge', 'lucide-react'],
                }
            }
        },
        // Set limit back to default 500kb since index.js will be tiny now
        chunkSizeWarningLimit: 500,
    }
})
