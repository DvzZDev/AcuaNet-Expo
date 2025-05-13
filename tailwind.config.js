/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'Inter-Black': ['Inter-Black', 'sans-serif'],
        'Inter-Bold': ['Inter-Bold', 'sans-serif'],
        'Inter-ExtraBold': ['Inter-ExtraBold', 'sans-serif'],
        'Inter-Light': ['Inter-Light', 'sans-serif'],
        'Inter-Medium': ['Inter-Medium', 'sans-serif'],
        'Inter': ['Inter-Regular', 'sans-serif'],
        'Inter-SemiBold': ['Inter-SemiBold', 'sans-serif'],
        'Inter-Thin': ['Inter-Thin', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
