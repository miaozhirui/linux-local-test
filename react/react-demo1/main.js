import React from 'react';
import {render} from 'react-dom';
import {Router,Route, Link, browserHistory, IndexRoute, hashHistory, Redirect, Lifecycle} from 'react-router';

const App = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,

	},
	componentDidMount: function(){
		const {route} = this.props;
		const {router} = this.context;
		router.setRouteLeaveHook(route, this.routerWillLeave)
	},
	render: function(){
		return (
			<ul>
				<li><Link to="/about">about</Link></li>
				<li><Link to="/inbox">inbox</Link></li>


				{this.props.children}
			</ul>
			
			)
	},
	routerWillLeave: function(nextLocation){
		if (true)
      	return 'Your work is not saved! Are you sure you want to leave?'
	}
})

const Index = React.createClass({
	render: function(){
		return (
			<h1>这是首页的内容</h1>
			)
	}
})

const About = React.createClass({
	render: function(){
		return (
			<h1>这里是About</h1>
			)
	}
})

const Inbox = React.createClass({
	render: function(){
		return (
			<div>
				<h1>这里是Inbox</h1>
				<li><Link to="/inbox/message/123">message</Link></li>
				{this.props.children}
			</div>
			)
	}
})

const Message = React.createClass({
	componentDidMount: function(){
		const id = this.props.params.id;
		console.log(id)
	},
	render: function(){
		return (
			<h3>message</h3>
			)
	}
})
const routes = {
	path: '/',
	// component: App,
	childRoutes: [
		{path: 'about', component: About},
		{path: 'Inbox', component: Inbox}
	],
	getComponents(location, callback){
		require.ensure([], function(require){
			callback(null, App);
		})
	}
}

render(<Router history ={hashHistory} routes ={routes} />,document.getElementById('example'));
// render((
// 	<Router history ={hashHistory}>
// 		<Route path="/" component={App}>
// 			<IndexRoute component={Index}/>
// 			<Route path="about" component={About}></Route>
// 			<Route path="Inbox" component={Inbox}>
// 				<Route path="/message/:id" component={Message}></Route>
// 				<Redirect from ="message/:id" to="/message/:id" />
// 			</Route>
// 		</Route>
// 	</Router>

// 	), document.getElementById('example'));

// render(<Router  routers = {routes} />, document.getElementById('example'));





















































