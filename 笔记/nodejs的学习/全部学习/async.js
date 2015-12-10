var fs = require('fs');

console.log('a');
fs.readFile('callback.js', function(err,data){
    console.log(data);
});
console.log('b');