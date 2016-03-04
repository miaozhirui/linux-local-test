
export default  {
	path: '/',
	component: require('../component/App/app'),
	indexRoute:{component: require('../component/select-department/index')},

	childRoutes: [
		{
			path: 'select-department',
			getComponent:(location, cb) => {
				require.ensure([], (require) => {
					cb(null, require('../component/select-department/index'))
				})
			}
		},

		{
			path: 'my-coupons',
			getComponent: (location, cb) => {
				require([], () => {
					cb(null, require('../component/my-coupons/index'));
				})
			}
		},
 
		{
			path: 'ask-question',
			getComponent: (location, cb) => {
				require.ensure([], ()=>{
					cb(null, require('../component/ask-question/index'));
				})
			}
		}
		
	]


}