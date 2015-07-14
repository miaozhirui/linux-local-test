var numDiv;
var work = null;

window.onload = function() {
  numDiv = document.querySelector('#numDiv');
  document.querySelector('#start').addEventListener('click', startWork,false);
  document.querySelector('#stop').addEventListener('click', function(){
    if(work) {
      work.terminate();
      work = null;
    }

  }, false);
}
function startWork() {
  if(work) return;
  work = new Worker("count.js");
  work.onmessage = function(e){
    numDiv.innerHTML = e.data;
  }
}