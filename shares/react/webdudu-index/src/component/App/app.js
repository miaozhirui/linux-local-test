import React from 'react';

const App = React.createClass({
	render: function(){
		return (
			<div className="dudu-box">
			
				{this.props.children}
			</div>
			)
	}
})


module.exports = App;