<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/javascript" src="../../jquery-1.8.3.js"></script>
    <script type="text/javascript">
    $(function() {
        var page = function(ele) {
            this.ele = $(ele);
            this.ele.name = "miaozhirui",
            this.ele.click(function() {
                console.log($(this).text())
            })
        }
        $.extend($.fn, {
            a: function() {
           this.each(function() {
                    new page(this)
                })
            }
        })
  
    $('.miao').a();
    // $('.miao').click(function(e){

    //     console.log($(this).text())
    // })
    // console.log($('.miao'))
    // console.log($('.miao')[0])
    // console.log($($('.miao')[0]))
      })
    </script>
</head>
<body>
    <div class="miao">11</div>
    <div class="miao">22</div>
    <div class="miao">33</div>
    <div class="miao">44</div>
    <div class="miao">55</div>
    <div class="miao">66</div>
    <div class="miao">77</div>
    <div class="miao">88</div>
</body>
</html>