<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/jquery.ui.widget.js"></script>
  <script type="text/javascript" src="js/jquery.iframe-transport.js"></script>
  <script type="text/javascript" src="js/jquery.fileupload.js"></script>
  <style type="text/css"> 
    .bar{
      height:18px;
      background: green;
    }
  </style>
</head>
<body>
<input class="fileupload" type="file" name="files[]" data-url="php/" multiple>
<div id="progress">
    <div class="bar" style="width: 0%;"></div>
</div>
<script type="text/javascript">
    $(function () {
    $('.fileupload').fileupload({
        dataType: 'json',
        limitConcurrentUploads:200000,
        formAcceptCharset: 'utf-8',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        },
        progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .bar').css(
            'width',
            progress + '%'
        );
    }
    });
});
</script>

</body>
</html>