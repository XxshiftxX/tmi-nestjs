module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    'import/extensions': ['.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.ts'],
      },
    },
  },
  rules: {
    "class-methods-use-this": "off",
    "no-useless-constructor": "off",
    "no-underscore-dangle": "off",

    "@typescript-eslint/no-explicit-any": "off",

    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.spec.ts"] }],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": "off",
  },
};