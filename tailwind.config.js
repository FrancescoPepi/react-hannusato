/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  // content: ["./app/**/*.{js,jsx,ts,tsx}"],
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // presets: ["nativewind/preset"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        custom: {
          shadowColor: 'blue',
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 6,
        },
      },
      colors: {
        bgCard: "#dcdcdd", // Sostituisci con il colore desiderato
        TitolCard: "#ffffff"
      },
    },
  },
  plugins: [],
}