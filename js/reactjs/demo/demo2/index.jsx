		console.log(1)
		

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