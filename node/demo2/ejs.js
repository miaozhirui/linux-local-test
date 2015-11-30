var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.get('/', function(req, res){
	res.render('home.ejs', {name: 'addName'});
})


app.listen('3000');