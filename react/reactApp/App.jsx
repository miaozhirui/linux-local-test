import React from "react";

var myStyle = {
	fontSize: 100,
	color:'red'
}

var arr = [
	<h1>菜鸟教程</h1>,
	<h2>学的不是技术，更是梦想!</h2>
];
// 1.jsx语法
// class App extends React.Component{

// 	render() {

// 		let i = 2;
// 		return (
// 				<div>
// 			     {/*返回新的内容*/}
// 					<h1 style={myStyle}>{i = 1? 'true': 'false'}</h1>
// 					Hello world!!<br/>
// 					欢迎来到菜鸟教程学习
// 					哈哈，你说的还真是对的啊
// 					<div>{arr}</div>
// 					<span>hello {this.props.name} {this.props.className}</span>
// 				</div>

// 			)
// 	}
// }

// 2.组件
// class Name extends React.Component{
// 	render() {
// 		return (
// 			<h1>{this.props.name}</h1>
// 		)
// 	}
// }

// class Link extends React.Component{
// 	render() {
// 		return (
// 			<h1> {this.props.site} </h1>
// 			)
// 	}
// }

// class App extends React.Component{
// 	render(){
// 		return (
// 			<div>
// 				<Name name={this.props.name}/>
// 				<Link site={this.props.site}/>
// 			</div>
// 			)
// 	}
// }

// 3.状态
// class App extends React.Component{

// 	constructor(){
// 		super()
// 		this.state = {
// 			liked: false
// 		}
// 	}

// 	render() {
// 		var text = this.state.liked ? '喜欢' : '不喜欢';
//  		return (
//  			<p onClick={this.handleClick.bind(this)}>
//  				你{text}我, 点击我切换状态!
//  			</p>
// 			)
// 	}

// 	handleClick() {
		
// 		this.setState({liked: !this.state.liked});
// 	}

// }

// 4.状态

class App extends React.Component{
	constructor() {
		super();

		this.defaultProps = {
			test: '这是一个test数据'
		}
	}
	// static defaultProps = {
	// 	name: 111
	// }
	render() {
		return (
			<h1>
				hello {this.props.name}
				{this.props.test}
			</h1>
			)
	}
}
export default App;























































