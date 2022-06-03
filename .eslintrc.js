module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi'
      },
      singleline: {
        delimiter: 'semi'
      }
    }]
  }
};
