import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E31D3C',
          light: '#FF2E4E',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
        },
        background: '#0A0A0A',
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.7)',
          dark: '#000000',
        },
        overlay: {
          dark: 'rgba(0, 0, 0, 0.7)',
          light: 'rgba(255, 255, 255, 0.05)'
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(45deg, #E31D3C, #FF2E4E)',
        'gradient-hover': 'linear-gradient(45deg, #FF2E4E, #FF4C6A)',
      },
      boxShadow: {
        'primary': '0 4px 15px rgba(227, 29, 60, 0.3)',
        'hover': '0 6px 20px rgba(227, 29, 60, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
