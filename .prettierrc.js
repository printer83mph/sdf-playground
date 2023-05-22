module.exports = {
  printWidth: 100,
  singleQuote: true,
  semi: false,
  endOfLine: 'auto',
  plugins: [require('prettier-plugin-tailwindcss'), require('prettier-plugin-glsl')],
  overrides: [{ files: ['*.frag'], options: { parser: 'glsl-parser' } }],
}
