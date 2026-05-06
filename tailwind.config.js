/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg: '#f5f7ff',
          surface: '#ffffff',
          border: '#d8e0ff',
          cyan: '#0ea5e9',
          magenta: '#d946ef',
          amber: '#f59e0b',
          dim: '#64748b',
        },
      },
      boxShadow: {
        glow: '0 12px 36px rgba(14, 165, 233, 0.22)',
        'glow-mag': '0 14px 40px rgba(217, 70, 239, 0.2)',
      },
      keyframes: {
        rankPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0.4)' },
          '50%': { boxShadow: '0 0 32px 8px rgba(255, 0, 170, 0.35)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        rankPulse: 'rankPulse 1.2s ease-in-out infinite',
        toastIn: 'toastIn 0.45s ease-out forwards',
      },
    },
  },
  plugins: [],
}
