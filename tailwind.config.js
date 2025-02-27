/** @type {import('tailwindcss').Config} */
export default {
    // ...existing config
    theme: {
        extend: {
            animation: {
                gradient: 'gradient 8s ease infinite',
            },
            backgroundSize: {
                '200%': '200%',
            },
        },
    },
    darkMode: 'class',
}