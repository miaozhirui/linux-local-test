exports.config = {
  allScriptsTimeout: 11000,

  //要运行的测试文件路径 
  specs: [
    '*.js'
  ],

  // 表示用哪个浏览器来运行测试用例
  capabilities: {
    'browserName': 'chrome'
  },

  // 表示测试文件中浏览器之间跳转页面的根路径
  baseUrl: 'http://miaozhirui-local.com/js/angular/jasmine/',

  // 表示用的是哪种框架
  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
