module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["jsx-a11y"],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    "plugin:jsx-a11y/recommended"
  ],
  rules: {
    // general
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-var': 'error',
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'no-useless-constructor': 'off', // disabled in favour of @typescript-eslint/no-useless-constructor

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
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021
  }
}
