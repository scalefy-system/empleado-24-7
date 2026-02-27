import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF6F1",
          dark: "#F0E8DE",
          border: "#E2D5C8",
        },
        rose: {
          DEFAULT: "#C9967A",
          light: "#E8C4B0",
          dark: "#A8765A",
        },
        gold: {
          DEFAULT: "#B8973A",
          light: "#D4B86A",
        },
        charcoal: "#2C2C2C",
        gray: {
          DEFAULT: "#8A8A8A",
          light: "#C8C8C8",
        },
        white: "#FFFFFF",
        success: "#7AAF8A",
        warning: "#D4A853",
        danger: "#C97A7A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(180, 140, 100, 0.10)",
        "card-hover": "0 8px 40px rgba(180, 140, 100, 0.18)",
      },
      borderRadius: {
        card: "12px",
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
