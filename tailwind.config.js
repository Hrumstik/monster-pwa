/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        reemkufi: ["Reem Kufi Ink"],
        roboto: ["Roboto"],
        inter: ["Inter"],
      },
      colors: {
        cardColor: "#20223B",
        cardBorder: "#121320",
        orangeSubtitle: "#E3CC02",
        defaultButton: "#515ACA",
        yellowTitle: "#E3CC02",
        green: {
          DEFAULT: "#45B172",
        },
      },
      fontSize: {
        "base-lg": "22px",
      },
    },
  },
  safelist: [
    "monster-input",
    "ant-input",
    "ant-input-affix-wrapper",
    "ant-input-disabled",
    "ant-input-textarea",
    "ant-input-affix-wrapper-disabled",
    "ant-input-focused",
    "ant-modal",
    "ant-modal-content",
    "ant-modal-title",
  ],
  plugins: [],
};
