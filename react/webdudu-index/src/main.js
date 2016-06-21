import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, hashHistory, IndexRoute, browserHistory} from 'react-router';

import routes from './config/routes.js';

//使用browserHistory webpack启动的时候
//加一个参数 --history-api-fallback
render(<Router history={browserHistory} routes={routes} />, document.getElementById('example'));


// import	SelectDeparment from './component/select-department/index'

// const App = React.createClass({
// 	render: function(){
// 		return (
// 			<div className="dudu-box">
// 				{this.props.children}
// 			</div>
// 			)
// 	}
// })


// render((
// 		<Router history={hashHistory}>
// 			<Route path="/" component={App}>
// 				<IndexRoute component={SelectDeparment}/>
// 				<Route path="/myCouons" component />
// 			</Route>
// 		</Router>
// 	),document.getElementById('example'));
