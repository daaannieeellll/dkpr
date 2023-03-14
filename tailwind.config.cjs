/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "linear-gradient(to top, var(--tw-gradient-stops)), url('/hero.webp')",
      },
      fontFamily: {
        code: ["Fira Code", "monospace"],
      },
      animation: {
        typing: "typing 0.8s steps(4), blink .7s step-end infinite alternate",
      },
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "4ch" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
