<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script type="text/javascript" src="../jquery-1.8.3.js"></script>
  <script type="text/javascript">
  var url = window.location.href
  console.log(url)
  $.ajax(url,{
    type: 'POST',
    dataType: 'html',
    success: function(data,text, request){
      console.log(11)
      console.log(request.getResponseHeader('Connection'))
    },
    error: function(XHR){
      console.log(XHR)
    },
    header: {
      name: 'miaozhiuri'
    }
  })
  </script>
  <script type="text/javascript">
// var readHeader = (function() {

//         // Hidden cache for the headers…
//         var _request = undefined;

//         return function(name) {
//             //
//             // We have a request cached…
//             ///
//             if (_request) {
//                 return _request.getResponseHeader(name);
//             }

//             //
//             // We need to get the request…
//             //
//             else {
//                 // Do the request and wait for it to complete.
//                 _request = new XMLHttpRequest();
//                 _request.open("HEAD", window.location, true);
//                 _request.send(null)
//                 // while (_request.readyState != 4) {console.log(12)};

//                 return _request.getResponseHeader(name);
//             }
//         }
//     })();
   // console.log( readHeader('Connection'))
  </script>
</head>
<body>
  
</body>
</html>