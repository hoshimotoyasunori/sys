module.exports = {
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx,js,jsx}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6750A4', // Material 3 Primary
        secondary: '#625B71',
        background: '#F8F7FA',
        surface: '#FFFFFF',
        error: '#B3261E',
        outline: '#79747E',
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: '#1C1B1F',
        onSurface: '#1C1B1F',
        onError: '#FFFFFF',
        border: '#E5E7EB', // 追加: border-border用
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}; 