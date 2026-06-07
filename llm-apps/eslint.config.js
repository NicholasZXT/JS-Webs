// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // ========== 1. 全局忽略 ==========
  { ignores: ['dist/**', 'node_modules/**', '*.min.js'] },

  // ========== 2. JavaScript 基础推荐规则 ==========
  js.configs.recommended,

  // ========== 3. TypeScript 推荐规则 ==========
  ...tseslint.configs.recommended,

  // ========== 4. 自定义项目配置 ==========
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        projectService: true,  // TS 类型感知规则（替代旧的 tsconfigRootDir）
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 自定义规则覆盖
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 关闭核心 no-unused-vars
      'no-unused-vars': 'off',
      // ⚠️ 如果用了 @typescript-eslint，必须同时关闭这个
      '@typescript-eslint/no-unused-vars': 'off'
    },
  },

  // ========== 5. 测试文件单独配置 ==========
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);