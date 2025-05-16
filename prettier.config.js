/** @type {import("prettier").Config} */
const config = {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  trailingComma: "es5",
  semi: false,
  singleQuote: false,
  bracketSpacing: true,
  arrowParens: "always",
  jsxSingleQuote: false,
  bracketSameLine: false,
  endOfLine: "lf",
  singleAttributePerLine: true,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindAttributes: ["className"],
}

module.exports = config
