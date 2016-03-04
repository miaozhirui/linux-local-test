// import React from 'react';
// import {render} from 'react-dom';

// import {Router, Route, RouteHandler, Link, StateMixin,browserHistory} from 'react-router';
// import $ from 'jquery';

// import App from './App.jsx';


// ReactDom.render(<App name='miaozhirui' className="test"/>, document.getElementById('app'));

// ReactDom.render(<App name='miaozhirui' site="test" />, document.getElementById('app'));

// 状态


// var App = React.createClass({
// 	getDefaultProps: function(){
// 		return {
// 			name: 'miaozhirui'
// 		}
// 	},

// 	render: function(){
// 		return (
// 			<h1>hello {this.props.name}</h1>
// 			)
// 	}
// })

// 属性传递
// var Name = React.createClass({
// 	render: function(){
// 		return (
// 			<h1>{this.props.name}</h1>
// 			)
// 	}
// })

// var Link = React.createClass({
// 	render: function(){
// 		return (
// 			<a href={this.props.site}>{this.props.site}</a>
// 			)
// 	}
// })


// var App = React.createClass({
// 	getDefaultProps: function(){
// 		return {
// 			name: '菜鸟',
// 			link: 'http://baidu.com'
// 		}
// 	},
// 	render: function(){
// 		return (
// 			<div>
// 				<Name name={this.props.name}/>
// 				<Link site={this.props.link}/>
// 			</div>
// 			)
// 	}
// })

// var title = "菜鸟教程";
// var App = React.createClass({
// 	propTypes: {
// 		title: React.PropTypes.string.isRequired
// 	},
// 	render: function(){
// 		return (
// 			<h1>{this.props.title}</h1>
// 			)
// 	}
// })


// setState
// var App = React.createClass({

// 	getInitialState: function(){
// 		return {

// 			clickCount: 0
// 		}
// 	},
// 	render: function(){
// 		return (
// 			<h1 onClick={this.handleClick}>总共点击了{this.state.clickCount}</h1>
// 			)
// 	},
// 	handleClick: function(){
// 		this.setState(function(state){
// 			return {
// 				clickCount: state.clickCount+1
// 			}
// 		})
// 	}
// })


// react组件生命周期
// var App = React.createClass({

// 	propTypes: {
// 		text: React.PropTypes.string.isRequired
// 	},
// 	getInitialState: function(){
// 		return {
// 			opacity:1
// 		}
// 	},

// 	componentDidMount: function(){
// 		setInterval(function(){

// 			var opacity = this.state.opacity;
// 			opacity -= .05;

// 			if(opacity<0.1){
// 				opacity = 1;
// 			}

// 			this.setState({opacity:opacity});

// 		}.bind(this),100)
// 	},

// 	render: function(){
// 		return (
// 			<h1 style={{opacity: this.state.opacity}}>{this.props.text}</h1>
// 			)
// 	}
// })


// jquery ajax的使用

// var App = React.createClass({
// 	propTypes: {
// 		url: React.PropTypes.string.isRequired
// 	},
// 	getInitialState: function(){
// 		return {
// 			name: '加载中...',
// 			url: '加载中...'
// 		}
// 	},
// 	componentDidMount: function(){
// 		var url = this.props.url;

// 		$.ajax(url, {
// 			type: 'GET',
// 		})
// 		.done(function(data){
// 			var userInfo = data[0];
// 			console.log(data[0])
// 			this.setState({
// 				name: userInfo['updated_at'],
// 				url: userInfo['url']
// 			})
// 		}.bind(this))
		

// 	},
// 	render: function(){
// 		return (
// 			<div>
// 				<p>姓名:{this.state.name}</p><br/>
// 				<p>url:{this.state.url}</p>
// 			</div>
// 			)
// 	}

// })
// ReactDom.render(<App url="https://api.github.com/users/octocat/gists"/>, document.getElementById('app'));


// react表单与事件

// var App = React.createClass({
// 	getInitialState: function(){
// 		return {
// 			value: 'hello miaozhirui'
// 		}
// 	},
// 	handleClick: function(event){
// 		this.setState({
// 			value: event.target.value
// 		})
// 	},
// 	render: function(){
// 		var value = this.state.value;
// 		return (
// 			<div>
// 			<input type="text" value={value} onChange={this.handleClick}/>
// 			<h4>{value}</h4>
// 			</div>
// 			)
// 	}
// })

// ReactDom.render(<App />, document.getElementById('app'));



// var Router = ReactRouter; // 由于是html直接引用的库，所以 ReactRouter 是以全局变量的形式挂在 window 上
// var Route = ReactRouter.Route; 
// var RouteHandler = ReactRouter.RouteHandler;
// var Link = ReactRouter.Link;
// var StateMixin = ReactRouter.State;

// import {Router, Route, RouteHandler, Link, StateMixin} from 'react-router';
/**
 * 图书列表组件
 */
// var Books = React.createClass({
//   render: function() {
//     return (
//       <ul>
//         <li key={1}><Link to="book" params={{id: 1}}>活着</Link></li>
//         <li key={2}><Link to="book" params={{id: 2}}>挪威的森林</Link></li>
//         <li key={3}><Link to="book" params={{id: 3}}>从你的全世界走过</Link></li>
//         <RouteHandler />
//       </ul>
//     );
//   }
// });

// /**
//  * 单本图书组件
//  */
// var Book = React.createClass({
//   mixins: [StateMixin],
  
//   render: function() {
//     return (
//       <article>
//        <h1>这里是图书 id 为 {this.getParams()['id']} 的详情介绍</h1>
//       </article>
//     );
//   }
// });

// /**
//  * 电影列表组件
//  */
// var Movies = React.createClass({
//   render: function() {
//     return (
//       <ul>
//         <li key={1}><Link to="movie" params={{id: 1}}>煎饼侠</Link></li>
//         <li key={2}><Link to="movie" params={{id: 2}}>捉妖记</Link></li>
//         <li key={3}><Link to="movie" params={{id: 3}}>西游记之大圣归来</Link></li>
//       </ul>
//     );
//   }
// });

// /**
//  * 单部电影组件
//  */
// var Movie = React.createClass({
//   mixins: [StateMixin],
  
//   render: function() {
//     return (
//       <article>
//        <h1>这里是电影 id 为 {this.getParams().id} 的详情介绍</h1>
//       </article>
//     );
//   }
// });



// // 应用入口
// var App = React.createClass({
//   render: function() {
//     return (
//       <div className="app">
//         <nav>
//           <a href="#"><Link to="movies">电影</Link></a>
//           <a href="#"><Link to="books">图书</Link></a>
//         </nav>
//         <section>
//           <RouteHandler />
//         </section>
//       </div>
//     );
//   }
// });
//  // <Router handler={App}>
//   //   <Route name="movies" handler={Movies} />
//   //   <Route name="movie" path="/movie/:id" handler={Movie} />
//   //   <Route name="books" handler={Books} />
//   //   <Route name="book" path="/book/:id" handler={Book} />
//   // </Router>

// // 定义页面上的路由
// var routes = (
 
//    <Router  history={browserHistory}>
//     <Route name="movies" handler={Movies} />
//     <Route name="movie" path="/movie/:id" handler={Movie} />
    
//     <Route name="books" handler={Books} />
//     <Route name="book" path="/book/:id" handler={Book} />
//   </Router>
// );


// render(routes,  document.getElementById('app'));







// import React from 'react'
// import { render } from 'react-dom'
// import { Router, Route, Link, browserHistory } from 'react-router'

// const App = React.createClass({
//   render: function(){
//     return <h1>App</h1>
//   }
// })
// const About = React.createClass({
//   render: function(){
//     return <h2>about</h2>
//   }
// })
// // etc.

// const Users = React.createClass({
//   render() {
//     return (
//       <div>
//         <h1>Users</h1>
//         <div className="master">
//           <ul>
//             {/* use Link to route around the app */}
//             {this.state.users.map(user => (
//               <li key={user.id}><Link to={`/user/${user.id}`}>{user.name}</Link></li>
//             ))}
//           </ul>
//         </div>
//         <div className="detail">
//           {this.props.children}
//         </div>
//       </div>
//     )
//   }
// })

// const User = React.createClass({
//   componentDidMount() {
//     this.setState({
//       // route components are rendered with useful information, like URL params
//       user: findUserById(this.props.params.userId)
//     })
//   },

//   render() {
//     return (
//       <div>
//         <h2>{this.state.user.name}</h2>
//         {/* etc. */}
//       </div>
//     )
//   }
// })

// // Declarative route configuration (could also load this config lazily
// // instead, all you really need is a single root route, you don't need to
// // colocate the entire config).
// render((
//   <Router history={browserHistory}>
//     <Route path="/" component={App}>
//       <Route path="about" component={About}/>
//       <Route path="users" component={Users}>
//         <Route path="/user/:userId" component={User}/>
//       </Route>
//     </Route>
//   </Router>
// ), document.body)

import React from 'react'
import { render } from 'react-dom'

// First we import some modules...
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

// Then we delete a bunch of code from App and
// add some <Link> elements...
const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        {/* change the <a>s to <Link>s */}
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>

        {/*
          next we replace `<Child>` with `this.props.children`
          the router will figure out the children for us
        */}
        {this.props.children}
      </div>
    )
  }
})

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>
), document.body)






