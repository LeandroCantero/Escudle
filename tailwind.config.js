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
                    accent: '#38bdf8',
                    success: '#10b981',
                    gold: '#fbbf24',
                },
                neo: {
                    green: '#00A676',
                    yellow: '#FFD23F',
                    purple: '#A663CC',
                    blue: '#5496FF',
                    orange: '#FF784F',
                    white: '#FFFFFF',
                    black: '#000000',
                }
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                'permanent-marker': ['Permanent Marker', 'cursive'],
            },
            boxShadow: {
                'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
                'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
                'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
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
