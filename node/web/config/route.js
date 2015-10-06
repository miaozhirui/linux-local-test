
module.exports = function(app){
// 首页
app.get('/index', function(req, res){
	res.render('index.jade', {
		title: 'miaozhirui',
		movies: [
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			},
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			},
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			}
		]
	})
})

// 详情页
app.get('/detail/:id', function(req, res){
	res.render('detail.jade', {
		title: 'miaozhirui',
		movies: [
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			},
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			},
			{
				_id:1,
				poster: '',
				title: 'miaozhirui1'
			}
		]
	})
})

}
