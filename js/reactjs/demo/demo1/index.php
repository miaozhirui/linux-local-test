<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
	<script type="text/javascript" src="../bower_components/react/react.js"></script>
	<script type="text/javascript" src="../bower_components/react/JSXTransformer.js"></script>
	<script type="text/javascript" src="../bower_components/react/marked.min.js"></script>
	<script type="text/javascript" src="../bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/jsx">
		//6
		var data = [
		{author: 'miaozhirui1', text: 'This is one text'},
		{author: 'miaozhirui2', text: 'This is other text'}
		]

		var Comment = React.createClass({
			render: function(){
				var data = this.props.data;
				return (
					<div className="comment">
						<h1>{data.author}</h1>
						<p>{data.text}</p>
					</div>
					);
			}
		})
		var CommentList = React.createClass({
			render: function(){
				var data = this.props.data;
				var commentNodes = data.map(function(item){
					return <Comment data={item} />
				})
				return (
					<div className="commentList">
						{commentNodes}
					</div>
					);
			}
		})
		var CommentForm = React.createClass({
			submitHandle: function(e){
				e.preventDefault();
				var author = React.findDOMNode(this.refs.author).value;
				var text = React.findDOMNode(this.refs.text).value;
				
				if(!text || !author){
					alert('有字段没有填')
					return 
				}

				this.props.postSubmitHandle({author:author, text: text});
				React.findDOMNode(this.refs.author).value='';
				React.findDOMNode(this.refs.text).value='';
			},

			render:function(){
			return (
					<form onSubmit={this.submitHandle}>
						<input type='text' placeholder="您的姓名" ref='author'/>
						<input type="text" placeholder="您想说的话" ref='text'/>
						<button type="submit">Post</button>
					</form>
					);
			}
		})
		var CommentBox = React.createClass({
			getInitialState: function(){
				return {data: []}
			},
			componentDidMount: function(){
				var self = this;

				$.ajax(this.props.url, {

					type: 'GET',
					dataType: 'json'
				}).done(function(data){

					self.setState({data:data})
				}).fail(function(xhr, status, error){

					console.error(self.props.url, status, error.toString())
				})
			},
			postSubmitHandle: function(comment){
				var data = this.state.data;
				var newComment = data.concat([comment]);
				this.setState({data:newComment});

				$.ajax(this.props.url, {
					type:'GET',
					dataType: 'json',
					data:comment,
				}).done(function(data){

				})
			},
			render: function(){
				return (
					<div className = "commentBox">
						<h1>comment</h1>
						<CommentList data={this.state.data}/>
						<CommentForm postSubmitHandle={this.postSubmitHandle}/>
					</div>
					);
			}
		})
		React.render(<CommentBox url="/ajax/comment.json"/>, document.body)
		// React.render(<CommentBox data={data} />, document.body);
		// 5
		// var Comment = React.createClass({
		// 	render: function(){
		// 		return (
		// 			<div className="comment">
		// 				<h2 className="comment-author">
		// 					{this.props.author}
		// 				</h2>
		// 				// {this.props.children}
		// 				{marked(this.props.children)}
		// 			</div>
		// 			);
		// 	}
		// })

		// var CommentList = React.createClass({
		// 	render: function(){
		// 		return (
		// 			<div className="commentList">
		// 				<Comment author="miaozhirui1">This is one comment</Comment>
		// 				<Comment author="miaozhirui2">This is other comment</Comment>
		// 			</div>
		// 			)
		// 	}
		// })
		// React.render(<CommentList/>, document.body);

		//4
		// var H2 = React.createClass({
		// 	render: function(){
		// 		return (
		// 			<h2>h2的内容</h2>
		// 			);
		// 	}
		// })
		// var H3 = React.createClass({
		// 	render: function(){
		// 		return (
		// 			<h3>h3的内容</h3>
		// 			);
		// 	}
		// })
		// var H1 = React.createClass({
		// 	render : function(){
		// 		return (
		// 			<div>
		// 				<h1>h1的内容</h1>
		// 				<H2 />
		// 				<H3 />
		// 			</div>
		// 			);
		// 	}
		// })

		// React.render(<H1/>, document.body);
		// 3
		// var Demo = React.createClass({
		// 	render: function(){
		// 		return (//第一个参数是要创建的元素，第二个是元素的配置，第三个元素是，元素里面的内容
		// 				React.createElement('div',{className: 'commentBox'},
		// 					"hello,world!"
		// 					)
		// 			);
		// 	}
		// })
		// React.render(<Demo/>, document.body)
		// 2
		// var CommentBox = React.createClass({
		// 	render: function(){
		// 		return (
		// 				<div>
		// 					<h1>hello miaozhirui!</h1>
		// 				</div>
		// 			);
		// 	}
		// })

		// React.render(<CommentBox/>, document.body)
		// 1
		// var Helloworld = React.createClass({
		// 	render: function(){
		// 		return <p>Hello world</p>;
		// 	}
		// })
	
		// React.render(<Helloworld></Helloworld>, document.body)

	</script>
	<script type="text/javascript">
		// var data = [1,2,3,4,5];
		// var data1 = data.map(function(item,index){
		// 	return item+'item'
		// })
		// console.log(data1)
	</script>
</head>
<body>
	
</body>
</html>