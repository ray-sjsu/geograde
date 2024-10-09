/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        geogradeTheme: {
          primary: "#00b2c9",
          secondary: "#00a7ff",
          accent: "#ee7c00",
          neutral: "#0e0515",
          "base-100": "#292529",
          info: "#00c6ff",
          success: "#337700",
          warning: "#ff8200",
          error: "#ff87a6",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")], // DaisyUI plugin here, no need to repeat
};
