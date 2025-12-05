import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "#0F3D5C",
        teal: "#1BA8A4",
        mist: "#E1F0F4",
        sandstone: "#F2E9E4",
        charcoal: "#0B1E2D",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 15px 35px rgba(15, 61, 92, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;