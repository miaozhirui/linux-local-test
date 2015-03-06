<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <script type="text/javascript">
    //可以将switch写成适配
    getRange(21)
    function getRange(range) {
        var range = 20<range>10 && '大于10的' || range>20 && '大于20的' || range>30 && '大于30的';
        console.log(range);
    }

    // 优化的代码
    // getNumber(1)
    // function getNumber (level) {
    //     var level = level;
    //     var origin = {
    //         '1': '等级1',
    //         '5': '等级5',
    //         '10': '等级10',
    //     }   
    //     var level = origin[level]|| '默认的等级';
    //     console.log(level)
    // }


    // 没有优化的代码
    // getNumber(5)
    //     function getNumber (level) {
    //         var level = level;
    //         switch(level) {
    //             case 1:
    //                 level = '等级1';
    //                 break;
    //             case 5:
    //                 level = '等级5';
    //                 break;
    //             case 10:
    //                 level = '等级10';
    //                 break;
    //             default:
    //                 level = '默认的等级';
    //         }
    //         console.log(level);
    //     }
    </script>
</body>
</html>