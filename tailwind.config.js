/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // Added this because your structure has files in root
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
