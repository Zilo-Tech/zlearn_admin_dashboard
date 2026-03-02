/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zlearn: {
          primary: '#446D6D',
          primaryHover: '#5a8a8a',
          primaryMuted: 'rgba(68, 109, 109, 0.08)',
          primaryBorder: 'rgba(68, 109, 109, 0.2)',
        },
        surface: {
          DEFAULT: '#FAFBFC',
          elevated: '#FFFFFF',
          muted: '#F3F4F6',
          border: '#E5E7EB',
          borderLight: '#F3F4F6',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'zlearn': '8px',
        'zlearn-lg': '12px',
      },
      boxShadow: {
        'zlearn-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'zlearn': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'zlearn-md': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'zlearn-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
