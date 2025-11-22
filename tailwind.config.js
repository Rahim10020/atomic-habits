/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Palette professionnelle - Grays neutres
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                    950: '#030712',
                },
                // Couleurs sémantiques
                success: {
                    DEFAULT: '#059669',
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                },
                warning: {
                    DEFAULT: '#D97706',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                },
                error: {
                    DEFAULT: '#DC2626',
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                'sm': '0.25rem',
                'DEFAULT': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            animation: {
                'bounce-in': 'bounceIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-in',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.15s ease-out',
            },
            keyframes: {
                bounceIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(8px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.98)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
