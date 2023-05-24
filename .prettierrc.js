module.exports = {
  printWidth: 100,
  singleQuote: true,
  endOfLine: 'auto',
  plugins: [require('prettier-plugin-tailwindcss'), require('prettier-plugin-glsl')],
  overrides: [{ files: ['*.frag'], options: { parser: 'glsl-parser' } }],
};
