module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: './node_modules/eslint-config-topaxi/eslint.json',
  rules: {
    'prefer-reflect': 0,
    'no-sequences': 0
  }
}
