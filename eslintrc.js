module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['jest'],
  extends: [
    // https://www.npmjs.com/package/@vue/eslint-config-typescript
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',

    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  rules: {
    // general
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-var': 'error',
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'no-useless-constructor': 'off', // disabled in favour of @typescript-eslint/no-useless-constructor

    // vue
    'vue/html-indent': [
      'error',
      2,
      { attribute: 1, closeBracket: 0, alignAttributesVertically: false }
    ],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/attribute-hyphenation': ['warn'],
    'vue/eqeqeq': ['error', 'always', { null: 'ignore' }],

    // typescript rules
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/no-type-alias': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true }
    ],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    // jest rules
    'jest/no-alias-methods': 0,
    'jest/no-if': 'error',
    'jest/no-test-prefixes': 0

    // TODO: following rules conflict with prettier:
    // "vue/max-attributes-per-line": [
    //   2,
    //   { singleline: 2, multiline: { max: 1, allowFirstLine: true } },
    // ],
    // "vue/html-closing-bracket-newline": ["error", { multiline: "never" }],

    // TODO: following rule does not exist
    // '@typescript-eslint/class-name-casing': 'error',

    // TODO: legacy rules (may not be useful any more)
    // "arrow-parens": 0,
    // "generator-star-spacing": 0,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021
  }
}
