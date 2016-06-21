
import React from 'react';
import {Link} from 'react-router';

import "./style.less";

const SelectDeparment = React.createClass({

	render: function (){ 
		var data = [  
			{
        "DepartmentName": "儿科",
        "DepartmentId": "1",
        "DepartmentImg": "./src/images/51.png"
		    }, {
		        "DepartmentName": "妇产科",
		        "DepartmentId": "2",
		        "DepartmentImg": "./src/images/51.png"
		    }, {
		        "DepartmentName": "妇产科",
		        "DepartmentId": "2",
		        "DepartmentImg": "./src/images/51.png"
		    }, {
		        "DepartmentName": "妇产科",
		        "DepartmentId": "2",
		        "DepartmentImg": "./src/images/51.png"
		    }, {
		        "DepartmentName": "妇产科",
		        "DepartmentId": "2",
		        "DepartmentImg": "./src/images/51.png"
		    }, {
		        "DepartmentName": "妇产科",
		        "DepartmentId": "2",
		        "DepartmentImg": "./src/images/51.png"
		    }
		]

		return (
			<div className="select-department">
				<div className="select-title">
					<span>欢迎使用嘟嘟医生电话咨询</span>
				</div>
				<h3>
					<span>选科室，填病情，等待医生来电</span>
				</h3>
				<DepartmentList data={data}/>
				<Nav />
			</div>
			)
	}
})

const DepartmentList = React.createClass({
	render: function(){
		var data = this.props.data;
		var list = [];

		data.forEach(function(item){
			
			list.push(<LiItem item={item}/>);
		})

		return (
			<ul>
				{list}	
			</ul>
			)
	}
})


const LiItem = React.createClass({
	render: function(){

		return (
			<li>
				<Link to="ask-question">
				<img src={this.props.item.DepartmentImg}/>
			     <p>
			     	<span>{this.props.item.DepartmentName}</span>
			     </p>	
				</Link>
			</li>
			)
	}
})

// const Nav = React.createClass({
// 	render: function(){
// 		return (
// 			   <footer className="footer ">
// 		        <section className="box">
// 		            <div className="doctor-team">
// 		                <span className="icon"></span>
// 		                <span className="desc">医生团队</span>
// 		                <span className="line"></span>
// 		            </div>
// 		            <div className="search-record">
// 		                <span className="icon"></span>
// 		                <span className="desc">咨询记录</span>
// 		                <span className="line"></span>
// 		            </div>
// 		            <div className="use-coupons" onClick={this.myCoupons}>
// 		                <span className="icon"></span>
// 		                <span className="desc">我的优惠券</span>
// 		            </div>
// 		        </section>
//     			</footer>
// 			)
// 	},
// 	myCoupons: function(){
// 		console.log(111)
// 	}
// })

class Nav extends React.Component{

	render() {
			return (
			   <footer className="footer ">
		        <section className="box">
		            <div className="doctor-team">
		                <span className="icon"></span>
		                <span className="desc">医生团队</span>
		                <span className="line"></span>
		            </div>
		            <div className="search-record">
		                <span className="icon"></span>
		                <span className="desc">咨询记录</span>
		                <span className="line"></span>
		            </div>
		            <div className="use-coupons" onClick={this.myCoupons.bind(this)}>
		                <span className="icon"></span>
		                <span className="desc">我的优惠券</span>
		            </div>
		        </section>
    			</footer>
			)
	}

	myCoupons() {

		location.href = "#/my-coupons";
	}
}

 module.exports = SelectDeparment;



 















