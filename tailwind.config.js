/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        reemkufi: ["Reem Kufi Ink"],
      },
      colors: {
        green: {
          DEFAULT: "#45B172",
        },
      },
    },
  },
  plugins: [],
};
