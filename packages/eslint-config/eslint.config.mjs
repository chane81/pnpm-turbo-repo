import { config as baseConfig } from './base.mjs';

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
];
