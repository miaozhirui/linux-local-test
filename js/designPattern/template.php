<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <script type="text/javascript">
    // caffee and tea 
        function template() {
          this.boilWater();
          this.brew();
          this.pourOnCup();
          if(this.addWantMeterial()) {
            this.addMeterial()
          }
        }

        template.prototype = {
          constructor: template,
          boilWater: function() {
            console.log('烧开水');
          },
          pourOnCup: function() {
            console.log('将水倒入到杯子当中');
          },
          brew: function() {
            throw new Error('重新写');
          },
          addMeterial: function() {
            throw new Error('重新写');
          },

          addWantMeterial: function() {
            console.log('想添加');
            return true;
          }
        }



      function Tea() {
        template.call(this);
        console.log('是基类');
      }
      Tea.prototype = template.prototype;
      Tea.prototype.brew = function() {
        console.log('泡tea')
      }
      Tea.prototype.addMeterial = function() {
        console.log('add 小料');
      }
      var newTea = new Tea();

    </script>
</body>
</html>