import preact from 'eslint-config-preact';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['build/', 'dist/'] },
  ...preact,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  prettier,
  {
    rules: {
      'prettier/prettier': ['error', { printWidth: 100, singleQuote: true }],
      'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
      'jsx-a11y/no-redundant-roles': 'off',
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: { 'no-undef': 'off' },
  },
];
