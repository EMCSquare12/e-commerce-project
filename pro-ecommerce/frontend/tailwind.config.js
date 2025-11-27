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
        },
    },
    plugins: [],
}