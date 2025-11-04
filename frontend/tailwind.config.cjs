/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ enables class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: '#22c55e',
        surface: '#0b1220',
        muted: '#f5f7fb',
        border: '#e5e7eb',
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: { xl: '14px' },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1.5px rgba(0,0,0,0.03)',
        'soft-md': '0 2px 8px rgba(0,0,0,0.06)',
        'soft-lg': '0 6px 20px rgba(0,0,0,0.10)',
      },
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
