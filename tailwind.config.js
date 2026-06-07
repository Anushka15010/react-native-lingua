/** @type {import('tailwindcss').Config} */
module.exports = {
    // NativeWind v4+ content array
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          "lingua-purple": "#5b21b6",
        },
      },
    },
    plugins: [],
  };