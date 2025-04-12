/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'speed-dice': `
          radial-gradient(circle, #1a8c52 1px, transparent 1px),
          radial-gradient(circle, red 2px, transparent 2px),
          radial-gradient(circle, yellow 2px, transparent 2px),
          radial-gradient(circle, blue 2px, transparent 2px),
          radial-gradient(circle, orange 2px, transparent 2px),
          radial-gradient(circle, purple 2px, transparent 2px)
        `,
      },
      backgroundSize: {
        confetti: `
          50px 50px, 
          200px 200px, 
          180px 180px, 
          160px 160px, 
          140px 140px, 
          120px 120px
        `,
      },
      backgroundPosition: {
        confetti: `
          0 0, 
          10px 20px, 
          50px 100px, 
          150px 80px, 
          100px 140px, 
          200px 50px
        `,
      },
      colors: {
        'felt-green': '#0f6b3c',
      },
    },
  },
  plugins: [],
};
