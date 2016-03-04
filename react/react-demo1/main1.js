// 没有用react-router的情况

import React from 'react';
import {render} from 'react-dom';
import {Router,Route, Link, browserHistory, IndexRoute} from 'react-router';

const App = React.createClass({
	getInitialState: function(){
		return {
			route: window.location.hash.substr(1)
		}
	},
	componentDidMount: function(){
		window.addEventListener('hashchange',()=>{
			console.log(window.location.hash.substr(1))
			this.setState({
				route: window.location.hash.substr(1)
			})
		})
	},
	render: function(){

		let route = this.state.route;
		let Child;
		
		switch(route){
			case '/tab1':
				Child = Tab1;
				break;
			case '/tab2':
				Child = Tab2;
				break;
			default: 
				Child = Index;

		}
		return (
			<ul>
				<li><a href="#/tab1">tab1</a></li>
				<li><a href="#/tab2">tab2</a></li>

				<Child/>
			</ul>
			
			)
	}
})

const Index = React.createClass({
	render: function(){
		return (
			<h1>这是首页的内容</h1>
			)
	}
})

const Tab1 = React.createClass({
	render: function(){
		return (
			<h1>这里是tab1</h1>
			)
	}
})

const Tab2 = React.createClass({
	render: function(){
		return (
			<h1>这里是tab2</h1>
			)
	}
})


// render((
// 	<Router history ={browserHistory}>
// 		<Route path="/" component={App}>
// 			<IndexRoute component={Index}/>
// 			<Route path="tab1" component={Tab1}></Route>
// 			<Route path="tab2" component={Tab2}></Route>
// 		</Route>
// 	</Router>

// 	), document.getElementById('example'));

render(<App />, document.getElementById('example'));








