/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        gargantua:
          "radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(255, 165, 0, 0.03) 30%, rgba(255, 255, 255, 0.01) 60%, rgba(0, 0, 0, 0.95) 100%)",
      },
      fontFamily: {
        display: ["JetBrains Mono", "monospace"],
        body: ["JetBrains Mono", "monospace"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-reverse": "floatReverse 5s ease-in-out infinite",
        "accretion-disk": "accretion-disk 8s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        wormhole: "wormhole 20s linear infinite",
        "orbital-motion": "orbital-motion 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
