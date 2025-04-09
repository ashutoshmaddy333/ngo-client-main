/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        orange: "#FA4032",
        lightOrange: "#FA812F",
        yellow: "#FAB12F",
        bg: "#FEF3E2",
      },
    },
  },
  plugins: [daisyui],
}

