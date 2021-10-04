module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-continue': 'off',
    'no-dupe-class-members': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'], //name the subproject folders here!!!
        extensions: ['.ts'],
      },
    },
  },
};
