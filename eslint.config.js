'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // Errores comunes
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-duplicate-imports': 'error',

      // Buenas prácticas
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',

      // Estilo
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
  {
    // Reglas más permisivas para los archivos de prueba
    files: ['test/**/*.js'],
    rules: {
      'prefer-arrow-callback': 'off',
    },
  },
];
