module.exports = {
  extends: [
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/semi": "warn",
    "@typescript-eslint/no-floating-promises": "error",
    "curly": "warn",
    "eqeqeq": "warn",
    "no-throw-literal": "warn",
    "semi": "off"
  },
  env: {
    'node': true
  },
  "ignorePatterns": [
    "out",
    "dist",
    "**/*.d.ts"
  ]
};
