import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-black": "var(--primary-black)",
        "primary-red": "var(--primary-red)",
        "light-gray": "var(--light-gray)",
        "soft-gray": "var(--soft-gray)",
        "bg-white": "var(--bg-white)",
      },
      fontFamily: {
        sans: ["var(--font-plex)", "IBM Plex Sans Arabic", "Almarai", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
