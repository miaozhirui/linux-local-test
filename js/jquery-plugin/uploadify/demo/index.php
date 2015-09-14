<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>文件上传类</title>
  <script type="text/javascript" src="../../../jquery.js"></script>
  <script type="text/javascript" src="../jquery.uploadify.js"></script>
</head>
<body>
<form>
<input id="file_upload" name="file_upload" type="file" multiple="true">
</form>
  <script type="text/javascript">
    <?php $timestamp = time();?>
    $(function() {
      $('#file_upload').uploadify({
        'swf'      : '../uploadify.swf',
        'uploader' : '../uploadify.php'
      });
    });
  </script>
</body>
</html>