import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Brand palette — The Blue Pearl
                'brand-maroon': {
                    DEFAULT: '#2A0A14',
                    50: '#6B1A2A',
                    100: '#5A1522',
                    200: '#4A111B',
                    300: '#3D0F1E',
                    400: '#2A0A14',
                    500: '#1E0810',
                    600: '#12060A',
                },
                'brand-gold': {
                    DEFAULT: '#C9A66B',
                    50: '#F5ECD6',
                    100: '#EDD9B3',
                    200: '#E0C48A',
                    300: '#D4AF37',
                    400: '#C9A66B',
                    500: '#B8914E',
                    600: '#9A7A3A',
                    700: '#7C6130',
                },
                'brand-silver': {
                    DEFAULT: '#A8A9AD',
                    50: '#E8E9EB',
                    100: '#D0D1D5',
                    200: '#B8B9BE',
                    300: '#A8A9AD',
                    400: '#8D8E92',
                    500: '#727376',
                    600: '#58595B',
                },
                'brand-black': {
                    DEFAULT: '#0A0608',
                    50: '#2A2228',
                    100: '#1E1A1C',
                    200: '#140F12',
                    300: '#0A0608',
                },
                // Semantic aliases
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
                display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
                sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #C9A66B 0%, #D4AF37 50%, #C9A66B 100%)',
                'maroon-gradient': 'linear-gradient(135deg, #2A0A14 0%, #3D0F1E 100%)',
                'velvet-texture': "url('/images/brand/velvet-bg.jpg')",
                'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,166,107,0.15) 50%, transparent 100%)',
            },
            boxShadow: {
                'gold': '0 4px 24px rgba(201,166,107,0.25)',
                'gold-lg': '0 8px 40px rgba(201,166,107,0.35)',
                'maroon': '0 4px 24px rgba(42,10,20,0.5)',
                'card': '0 2px 16px rgba(0,0,0,0.18)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'gold-pulse': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,166,107,0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(201,166,107,0)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                shimmer: 'shimmer 2.5s linear infinite',
                'fade-in': 'fade-in 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
                marquee: 'marquee 30s linear infinite',
            },
        },
    },
    plugins: [],
}

export default config
