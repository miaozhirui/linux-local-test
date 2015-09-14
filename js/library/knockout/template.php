<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>bindingHandlers</title>
  <script type="text/javascript" src="knockout-3.0.0.js"></script>
  <script type="text/javascript" src="../jquery-1.8.3.js"></script>
</head>
<body>
  <ul>
    <li data-bind="foreach: arr">
      <p data-bind="text: name"></p>
    </li>
  </ul>
  <button data-bind="click: getHistoryData.bind($data, name, '2'), enable: enableBtn">点击</button>
  <script type="text/javascript">
var obj = null;
    $.ajax('/js/ajax/ko/first.json',{
      type:'GET',
      dataType:'json',
    }).done(function(data){
      obj = new initData(data)
      ko.applyBindings(obj)
    })

    function initData(data) {
      var self = this;
      this.arr = ko.observableArray(data)
      this.enableBtn = ko.observable(true);
      this.name='miaozhirui';

      this.getHistoryData = function(first,second) {
        console.log(first)
        console.log(second)
       $.ajax('/js/ajax/ko/second.json', {
          type:'GET',
          dataType: 'json'
        }).done(function(data){
          self.arr(data.content)
          self.enableBtn(data.enableBtn)
        })
       }
    }
    // document.getElementById('btn').onclick = function() {
    //   $.ajax('/js/ajax/ko/second.json', {
    //     type:'GET',
    //     dataType: 'json'
    //   }).done(function(data){
    //     obj.arr(data)
    //   })
    // }
    </script>
</body>
</html>