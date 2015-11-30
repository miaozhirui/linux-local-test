var myScroller=$("#scroll").scroller(); //no parameters
myScroller.addPullToRefresh();
 
//User is dragging the page down exposing the pull to refresh message.
$.bind(myScroller, "refresh-trigger", function () {
    console.log("Refresh trigger");
});
 
//Here we listen for the user to pull the page down and then let go to start the pull to refresh callbacks.
var hideClose;
$.bind(myScroller, "refresh-release", function () {
    var that = this;
    console.log("Refresh release");
    clearTimeout(hideClose);
    //For the demo, we set a timeout of 5 seconds to show how to hide it asynchronously
    hideClose = setTimeout(function () {
        console.log("hiding manually refresh");
        that.hideRefresh();
    }, 5000);
    return false; //tells it to not auto-cancel the refresh
});
 
//This event is triggered when the user has scrolled past and the pull to refresh block is no longer available
$.bind(myScroller, "refresh-cancel", function () {
    clearTimeout(hideClose);
    console.log("cancelled");
});

//The following shows how to implement infinite scrolling. Like pull to refresh, you must use $.bind on the scroller object.
myScroller.addInfinite();

//Bind the infinite scroll event
$.bind(myScroller, "infinite-scroll", function () {
  var self = this;
  console.log("infinite triggered");
  //Append text at the bottom
  $(this.el).append('<div id="infinite" style="border:2px solid black;margin-top:10px;width:100%;height:20px">Fetching content...</div>');
  //Register for the infinite-scroll-end - this is so we do not get it multiple times, or a false report while infinite-scroll is being triggered;
  $.bind(myScroller, "infinite-scroll-end", function () {
      //unbind the event since we are handling it
      $.unbind(myScroller, "infinite-scroll-end");
      self.scrollToBottom();
      //Example to show how it could work asynchronously
      setTimeout(function () {
          $(self.el).find("#infinite").remove();
          //We must call clearInfinite() when we are done to reset internal variables;
          self.clearInfinite();
          $(self.el).append('<div>This was loaded via inifinite scroll<br>More Content</div>');
          self.scrollToBottom();
      }, 3000);
  });
});