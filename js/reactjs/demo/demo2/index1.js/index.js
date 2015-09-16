		console.log(1)
		

		var data = [
		{author: 'miaozhirui1', text: 'This is one text'},
		{author: 'miaozhirui2', text: 'This is other text'}
		]

		var Comment = React.createClass({displayName: "Comment",
			render: function(){
				var data = this.props.data;
				return (
					React.createElement("div", {className: "comment"}, 
						React.createElement("h1", null, data.author), 
						React.createElement("p", null, data.text)
					)
					);
			}
		})
		var CommentList = React.createClass({displayName: "CommentList",
			render: function(){
				var data = this.props.data;
				var commentNodes = data.map(function(item){
					return React.createElement(Comment, {data: item})
				})
				return (
					React.createElement("div", {className: "commentList"}, 
						commentNodes
					)
					);
			}
		})
		var CommentForm = React.createClass({displayName: "CommentForm",
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
					React.createElement("form", {onSubmit: this.submitHandle}, 
						React.createElement("input", {type: "text", placeholder: "您的姓名", ref: "author"}), 
						React.createElement("input", {type: "text", placeholder: "您想说的话", ref: "text"}), 
						React.createElement("button", {type: "submit"}, "Post")
					)
					);
			}
		})
		var CommentBox = React.createClass({displayName: "CommentBox",
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
					React.createElement("div", {className: "commentBox"}, 
						React.createElement("h1", null, "comment"), 
						React.createElement(CommentList, {data: this.state.data}), 
						React.createElement(CommentForm, {postSubmitHandle: this.postSubmitHandle})
					)
					);
			}
		})
		React.render(React.createElement(CommentBox, {url: "/ajax/comment.json"}), document.body)