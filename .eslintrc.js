module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
  	'html',
    'vue'	
  ],
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "quotes": [0, "single"],	// 禁用引号检查	引号类型 `` "" ''
    "semi": 0,  				// 禁用分号检查	[1, "always"]: 需要分号, [2, "never"]: 不加分号, 0: 禁用此项
    "vue/html-self-closing": "off",
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": true,
    }],
    "indent": "off",	
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
