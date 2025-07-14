/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./screens/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./navigation/**/*.{js,ts,tsx}",
    "./App/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
    "./index.js",
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "Inter-Black": ["Inter-Black", "sans-serif"],
        "Inter-Bold": ["Inter-Bold", "sans-serif"],
        "Inter-ExtraBold": ["Inter-ExtraBold", "sans-serif"],
        "Inter-Light": ["Inter-Light", "sans-serif"],
        "Inter-Medium": ["Inter-Medium", "sans-serif"],
        Inter: ["Inter-Regular", "sans-serif"],
        "Inter-SemiBold": ["Inter-SemiBold", "sans-serif"],
        "Inter-Thin": ["Inter-Thin", "sans-serif"],
        "Inter-Black-Italic": ["Inter-Black-Italic", "sans-serif"],
        "Black-Rolmer": ["Black-Rolmer", "sans-serif"],
        "Black-Oblique": ["Black-Oblique", "sans-serif"],
      },
    },
  },
  plugins: [],
}
