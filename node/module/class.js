var student = require('./student');
var teacher = require('./teacher');

function add(teacherName, student){
	console.log(teacher.add(teacherName));

	student.forEach(function(item, index){
		console.log(item,index)
	})
}

exports.add = add;
