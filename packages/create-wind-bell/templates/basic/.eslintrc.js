module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["xbell"],
  parserOptions: {
    project: './tsconfig.json'
  }
};