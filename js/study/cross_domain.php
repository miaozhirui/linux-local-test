<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script type="text/javascript" src="../jquery-1.8.3.js"></script>
</head>
<body>
	<script type="text/javascript">
	$.ajax('http://miaozhirui-lab.com/ajax/cross_domain/1.php', {
		type: 'get',
		dataType:'json'
	}).done(function(data){
		console.log(data)
	})
	</script>
</body>
</html>