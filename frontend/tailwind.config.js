module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        'primary-dark': '#15803D',
        'primary-light': '#DCFCE7',
        bg: '#F8FAFC',
        text: '#0F172A',
        'text-secondary': '#64748B',
        border: '#E2E8F0',
        error: '#DC2626',
        warning: '#F59E0B',
        success: '#16A34A'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
