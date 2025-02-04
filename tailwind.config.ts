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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#125B60",
        secondary: "#298187",
        yellow: "#FACF28",
        darkGrey: "#666666",
        lightGrey: "#F0F0F0",
        darkBlue: "#15355E",
      },
      fontFamily: {
        sofia: ["Sofia Pro", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
    },
  },
  plugins: [],
};

export default config;
