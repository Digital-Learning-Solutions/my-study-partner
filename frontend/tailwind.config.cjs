/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ enables class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        // Your existing marquee animation
        marquee: "marquee 25s linear infinite",
        // The new gradient animation
        gradient: "gradient 15s ease infinite",
      },
      keyframes: {
        // Your existing marquee keyframes
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // The new gradient keyframes
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
