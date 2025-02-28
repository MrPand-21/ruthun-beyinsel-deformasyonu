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
            colors: {
                'bg': 'var(--bg)',
                'fr': 'var(--text-primary)',
                'fr-inverted': 'var(--text-inverted)',
                'moon-color': 'var(--moon-color, #6366f1)',
                "primary": {
                    DEFAULT: 'var(--primary)',
                    '50': '#f6f7ff',
                    '100': '#eef0fe',
                    '200': '#d4d7fd',
                },
                "secondary": "var(--secondary)",
                "secondary-soft": "var(--secondary-soft)",
            },
        },
        content: [
            "./src/**/*.{html,js,svelte,ts}",
            "./src/lib/components/Hero.svelte"
        ]
    },
    darkMode: 'class',
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },

        ...["logo-end", "primary", "secondary", "pop", "pop-soft", "foreground", "foreground-soft", "background", "secondary-soft", "secondary-soft-2", "primary-soft"].flatMap((customColor) => [
            `bg-${customColor}`,
            `border-${customColor}`,
            `hover:bg-${customColor}`,
            `hover:border-${customColor}`,
            `hover:text-${customColor}`,
            `fill-${customColor}`,
            `ring-${customColor}`,
            `stroke-${customColor}`,
            `text-${customColor}`,
            `ui-selected:bg-${customColor}`,
            `ui-selected:border-${customColor}`,
            `ui-selected:text-${customColor}`,
        ])

    ],


}