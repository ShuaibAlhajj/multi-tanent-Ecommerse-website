import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        mist: '#E2E8F0',
        paper: '#F8FAFC',
        accent: '#0F766E',
        amber: '#B45309',
        coral: '#C2410C',
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(15, 23, 42, 0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      animation: {
        floatIn: 'floatIn 700ms ease-out forwards',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
