/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      sm: "0px",
      md: "750px",
      lg: "1050px",
    },
    extend: {
      backgroundColor: {
        glass: "#dbe1e3",
        dark: "#00000090",
        "glass-dark": "#AFB4B6",
        "dark-white": "#dcdcdc",
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        grey: "#c9c9c9",
      },
      borderRadius: {
        xmd: "20px",
      },
      width: {
        "10%": "10%",
        "20%": "20%",
        "30%": "30%",
        "40%": "40%",
        "50%": "50%",
        "60%": "60%",
        "70%": "70%",
        "80%": "80%",
        "90%": "90%",
        "100%": "100%",
      },
      height: {
        "10%": "10%",
        "20%": "20%",
        "30%": "30%",
        "40%": "40%",
        "50%": "50%",
        "60%": "60%",
        "70%": "70%",
        "80%": "80%",
        "90%": "90%",
        "100%": "100%",
        800: "800px",
      },
      fontSize: {
        "6xl": "7rem",
      },
      backgroundImage: {
        "custom-image": "url('/background.jpg')",
      },
      zIndex: {
        1: "1",
      },
      colors: {
        myGrey: "#676767",
        textcol: "#c9c9c9",
        textcol2: "#2E2E2E",
        "dark-white": "#dcdcdc",
        locktext: "#16AF25",
      },
      fontSize: {
        13: "13px",
        14: "14px",
        15: "15px",
        16: "16px",
        17: "17px",
        18: "18px",
        19: "19px",
      },
      maxHeight: {
        "50%": "50%",
      },
    },
  },
  plugins: [],
};
