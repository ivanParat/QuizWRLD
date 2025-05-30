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
        black: "var(--foreground)",
        "background-form": "#E0E6EC",
        brand: {
          DEFAULT: "#007BFF",
          hover: "#63aeff",
          light: "#B1D7FF",
          dark: "#243648",
        },
        accent: "#FFC107",
        "off-white": "#F8F9FA",
        "main-text": "#343A40",
        "secondary-text": "#6C757D",
        correct: {
          DEFAULT: "#28A745",
          hover: "#66d17f",
        },
        incorrect: {
          DEFAULT: "#DC3545",
          hover: "#ed7782",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
