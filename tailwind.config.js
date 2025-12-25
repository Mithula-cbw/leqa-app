// Leqa © 2025 Mithula Chanthuka
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        test: "#ff0000",        // Red for testing

        primary: "#22c55e",    
        background: "#ffffff", // Black
        surface: "#ffffff",    // Card background
        textMain: "#0f172a",   // Dark slate
      },
    },
  },
  plugins: [],
};