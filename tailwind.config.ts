import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                background: '#0f0f14',
                surface: '#171826',
                text: '#f5f0e8',
                blush: '#f4a7b9',
                cream: '#f7efe7'
            },
            boxShadow: {
                soft: '0 20px 60px rgba(15, 15, 20, 0.35)'
            }
        }
    },
    plugins: [require('@tailwindcss/typography')]
};

export default config;
