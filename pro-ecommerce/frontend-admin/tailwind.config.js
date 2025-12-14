/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // You can add custom colors here later if you want
                // example: 'brand-blue': '#123456',
            },
            keyframes: {
                slideDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                slideDown: 'slideDown 0.5s ease-in-out forwards',
            },
        },
    },
    plugins: [],
}