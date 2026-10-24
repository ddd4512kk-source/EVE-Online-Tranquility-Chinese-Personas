import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', '_site/**', '.cache/**', 'src/assets/fonts/**'] },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: { '@stylistic': stylistic },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      'no-undef': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-invalid-regexp': 'error',
      'no-unsafe-finally': 'error',
      'valid-typeof': 'error',
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
  {
    files: ['src/assets/js/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/sw.js'],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    // 取材目录含交给浏览器／REPL 执行的片段，其全局变量由调用环境注入。
    files: ['scripts/research/**/*.mjs'],
    rules: { 'no-undef': 'off' },
  },
];
