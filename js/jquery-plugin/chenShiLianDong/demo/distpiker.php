<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script type="text/javascript" src="../../../jquery-1.8.3.js"></script>
  <script type="text/javascript" src="../distpicker/src/distpicker.data.js"></script>
  <script type="text/javascript" src="../distpicker/src/distpicker.js"></script>
</head>
<body>
<form>
    <div data-toggle="distpicker">
    <select data-province="浙江省" name="province[]"></select>
    <select data-city="宁波市" name="city"></select>
    <select data-district="滨江区" name="district"></select>
    </div>

    <div class="distpicker1">
      <select name="province[]"></select>
      <select></select>
      <select></select>
    </div>
    <button type="submit" class="confirm">提交</button>
</form>

<script type="text/javascript">
  $('.distpicker1').distpicker({
    province: "--所在省--",
    city: "--所在市--",
    district: "--所在区--",
    autoSelect: false
  });  

  $('.confirm').on('click', function(){
      $.ajax({
        type:'post',
        url: '/ajax/distpiker.php',
        data: $('form').serialize(),
        success: function(){

        }
  })
    return false;

  })
</script>
</body>
</html>