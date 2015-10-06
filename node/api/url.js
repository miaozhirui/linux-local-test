// url.parse
// url.format
// url.resolve

var parseUrl = require('url');
// console.log(url)

var url = "http://www.baidu.com/index/immoc?miaozhirui=1";
// console.log(parseUrl.parse(url))

// console.log(parseUrl.format({
//   protocol: 'http:',
//   slashes: true,
//   auth: null,
//   host: 'www.baidu.com',
//   port: null,
//   hostname: 'www.baidu.com',
//   hash: null,
//   search: '?miaozhirui=1',
//   query: 'miaozhirui=1',
//   pathname: '/index/immoc',
//   path: '/index/immoc?miaozhirui=1',
//   href: 'http://www.baidu.com/index/immoc?miaozhirui=1' }))

// console.log(parseUrl.resolve('http://immoc.com', '/course/list'));

//如果加上第二个参数的话，就可以用querystring解析query了
// console.log(parseUrl.parse(url, 'true'))

// 加上第三个参数的时候会自动解析域名
console.log(parseUrl.parse('//immoc.com/course/list', true,true))




























