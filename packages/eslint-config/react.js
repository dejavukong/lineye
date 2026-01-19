import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import base from './base.js';

export default defineConfig(
  // Extend base config
  ...base,

  // React Refresh for Vite HMR
  reactRefresh.configs.vite,

  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React recommended rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off', // TypeScript handles prop validation
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',

      // React Hooks rules (v7+ includes React Compiler support)
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': [
        'error',
        {
          additionalHooks: '(useAsyncFn|useDebounceFn|useDeepCompareEffect)',
        },
      ],
    },
  }
);
