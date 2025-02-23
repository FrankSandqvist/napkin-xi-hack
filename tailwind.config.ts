import type { Config } from "tailwindcss";

export default {
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
      },
    },
    fontFamily: {
      rowdies: ["Rowdies"],
      kodeMono: ["Kode Mono"],
      sans: ["system-ui", "sans-serif"],
    },
    animation: {
      "appear-from-bottom": "appear-from-bottom 0.3s ease-out",
    },
    keyframes: {
      "appear-from-bottom": {
        "0%": {
          transform: "translateY(30%)",
          opacity: "0",
        },
        "100%": {
          transform: "translateY(0)",
          opacity: "1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
