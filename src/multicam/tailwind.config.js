const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    mode:  'jit',
    purge: [
        "./index.html",
        //"src/multicam/public/**/*.html",
        //"src/multicam/src/**/*.{js,jsx,ts,tsx,vue}"
        "./src/**/*.{js,jsx,ts,tsx,vue}"
    ], //we gotta come back to this. tailwind css gets a biig.
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },

            colors: {
                bgray: colors.coolGray,
                wgray: colors.warmGray,
                lime: colors.lime,
                teal: colors.teal

            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
/*
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
*/