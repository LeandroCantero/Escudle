/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0f172a',
                    card: 'rgba(30, 41, 59, 0.7)',
                    accent: '#38bdf8', // Light blue
                    success: '#10b981', // Emerald
                    gold: '#fbbf24', // Yellow 400
                }
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', scale: '0.9' },
                    '100%': { opacity: '1', scale: '1' },
                }
            }
        },
    },
    plugins: [],
}
