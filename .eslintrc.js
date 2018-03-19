module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'space-before-function-paren': 0,
    'padded-blocks': 0,
    'semi': 0,
    'no-extra-semi': 0,
    'no-trailing-spaces': 0,
    'spaced-comment': 0,
    'no-unneeded-ternary': 0
  }
}
