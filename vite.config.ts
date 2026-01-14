import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
