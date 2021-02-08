module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': [
    'plugin:vue/essential',
    'google',
    'eslint:recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
  ],
  'rules': {
  },
};
