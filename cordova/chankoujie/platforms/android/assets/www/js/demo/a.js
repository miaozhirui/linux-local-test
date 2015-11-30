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