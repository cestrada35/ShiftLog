// tailwind.config.js
import primeui from 'tailwindcss-primeui'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
  ],
  plugins: [primeui],
}