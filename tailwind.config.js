const colors = require('tailwindcss/colors')
module.exports = {
  mode:  'jit',
  purge: [
    "src/Safr.Client/public/**/*.html",
    "src/Safr.Client/src/**/*.{js,jsx,ts,tsx,vue}"
  ], //we gotta come back to this. tailwind css gets a biig.
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {

      colors: {
          bgray: colors.coolGray,
          wgray: colors.warmGray,
          lime: colors.lime

      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
