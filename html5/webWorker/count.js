function value() {
  var countNum = 0;
  return {
    countNum : countNum
  };
}
var countNum = value();
function count(){
  postMessage(countNum.countNum++);
  setTimeout(count,1000);
}
count();