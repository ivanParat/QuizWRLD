import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: '#007BFF', 
          light: '#B1D7FF',  
          dark: '#243648',   
        },
        'accent': '#FFC107',
        'off-white': '#F8F9FA',
        'main-text': '#343A40',
        'secondary-text': '#6C757D',
        'correct': '#28A745',
        'incorrect': '#DC3545',
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"], // Map to Roboto
      },
    },
  },
  plugins: [],
} satisfies Config;
