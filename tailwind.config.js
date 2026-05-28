/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepOceanNavy: '#344A64',
        waterlineBlue: '#5484B7',
        softAquaBlue: '#8BB4D2',
        mistSkyBlue: '#BBD3E0',
        foamWhite: '#DAE5EA',
        primary: '#344A64',
        secondary: '#5484B7',
        accent: '#8BB4D2',
        surface: '#BBD3E0',
        background: '#DAE5EA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
