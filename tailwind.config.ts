// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#00e5ff", // example highlight
        bgPrimary: "#0d0d0d",
        bgCard: "#1a1a1a",
      },
    },
  },
  plugins: [],
};
