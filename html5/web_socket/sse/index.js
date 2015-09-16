var source;
function init(){
  source = new EventSource('data.php');
  source.onopen = function(e){
      console.log('连接已建立',this.readyState);
  }
  source.onmessage = function(event){
    console.log(JSON.parse(event.data))
  }
  source.onerror = function(event){
    // console.log(event)
  }
}
init();