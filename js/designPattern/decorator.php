<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>装饰者模式</title>
</head>
<body>
    <script type="text/javascript">
        function Macbook() {//这个是基类，可以在此基础上面添加各个类自动义的功能
            this.cost = function() {
                return 100;
            }
        }
        function Memort(macbook) {
            this.cost = function() {
                return macbook.cost() + 75;
            }
        }
        function BlurayDrive(macbook) {
            this.cost = function() {
                return macbook.cost()+ 300;
            }
        }
        function Insurance(macbook) {
            this.cost = function() {
                return macbook.cost() + 250;
            }
        }
        function Last(macbook) {
            this.cost = function() {
                return macbook.cost() + 1000;
            }
        }

        //上面的用法(用户自定义的功能)
        var myMacBook = new Last(new Insurance(new BlurayDrive(new Memort(new Macbook))));
        // console.log(myMacBook.cost())
    </script>
</body>
</html>