/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        reemkufi: ["Reem Kufi Ink"],
        roboto: ["Roboto"],
      },
      colors: {
        cardColor: "#20223B",
        cardBorder: "#121320",
        orangeSubtitle: "#E3CC02",
        defaultButton: "#515ACA",
        green: {
          DEFAULT: "#45B172",
        },
      },
      fontSize: {
        "base-lg": "22px",
      },
    },
  },
  plugins: [],
};
