// feed/wall
(function(){
	/**
	 * feed FrameWork: support absolute(high performance) and normal positioned feed Rcd
	 * feed wall may set following wall ATTRS:
	 * dataUri: url used to loading datas
	 * feedRcd: wall rcd class;
	 * renderFunc: func to render loaded data rcds
	 * wallData: used to contain tmp hided wall rcds (for scroll performance) (optional)
	 * triggerBar: trigger bar used to load next sub page (optional)
	 * pageBar: bar used to paging(optional)
	 * allLoaded: loaded status
	 * maxSpage: max Sub pages
	 * masonry: if this is a masonry wall whose rcds used *absolute* positioned(high performance for rendering) (optional)
	 * cols: masonry wall columns (fixed width wall) (optional)
	 * wOffX: wall rcd horizontal margin; (optional) // wOffX=0 for cols=1
	 * wOffY: wall rcd vertical margin; (optional)
	 * sizeUnit: wall rcd self contained image whose size need to be adjusted (optional) 
	 * oImgWd: sizeUnit image original width (optional)
	 * wWallPad: wall horizontal padding (optional)
	 * popTip: 1st page loading tip;
	 * 
	 * ##### caled by feed FrameWork #####
	 * wRate: new and original image size rate
	 * wRcdWd: wall rcd width
	 */
    $.feed = {
        loadMoreMsg:'加载更多',
	    loadingMsg: '<img src="./img/loading.gif">',
	    reloadMsg:'<i class="fa fa-rotate-left"></i>重新加载',
	    noDataMsg:'<i class="fa fa-smile-o"></i>没有查询到内容',
	    noMoreDataMsg:'-木有更多了-',
	    
    	tmp:{sTime:0, eTime:0}, //>>> test performance
    	
        init: function(wallSel) {
            var wall = $.query(wallSel);
            if(!wall[0]) return;
            
            if(wall.attr('masonry') && wall.attr('masonry') == 'y') {
            	$.feed.setMasonryParams(wall);
            }
        	
            wall.attr('isLoading', 'n');
            wall.attr('triggerBar') && $(wall.attr('triggerBar')).on('click', function(e){
            	e.stopPropagation();e.preventDefault(); 
            	
            	//$.feed.tmp.sTime = new Date().getTime();
            	var nPage = parseInt(wall.attr('page')), nSpage = parseInt(wall.attr('spage'))+1; //>>>paging: only change sub page counter
            	$.feed.loadData(wall, nPage, nSpage);
            });
            $(wall.attr('pageBar')).on('click', '.switchpage', function(e){
            	e.stopPropagation();e.preventDefault();
            	
            	var nPage = parseInt(wall.attr('page')), nSpage = 1; //>>>paging: only change page counter
            	if($(this).hasClass('prev')){
            	    wall.attr('allLoaded', 'n'); 
            	    nPage -= 1; 
            	    if(nPage < 1) nPage =1;
            	} else {
            	    nPage += 1;
            	}
            	//reset
            	$.feed.resetWall(wallSel, false);
            	$.feed.loadData(wall, nPage, nSpage);
            });
        },
        
        //used by pull2refresh
        wallLoadData: function(wall) {
            var nPage = parseInt(wall.attr('page')), nSpage = parseInt(wall.attr('spage'))+1; //>>>paging: only change sub page counter
            $.feed.loadData(wall, nPage, nSpage);
        },
        
        setMasonryParams: function (wall){
        	var vvcfg 	= $.vv.cfg, wOffX = parseFloat(wall.attr('wOffX')), cols = parseInt(wall.attr('cols'));
    	 	wRcdWd	= (vvcfg.cWidth - wOffX * (cols - 1) - (2*parseFloat(wall.attr('wWallPad'))))/cols, //cal wall item rcd width
    	 	wImgWd 	= wRcdWd;
    	 	wall.attr({'wRcdWd': wRcdWd});
    	 	if(wall.attr('sizeUnit'))wall.attr({'wImgWd': wRcdWd, 'wRate': wImgWd/parseFloat(wall.attr('oImgWd'))});
        },
        
        resetWall: function(wallSel, resetPage){
        	var wall = $.query(wallSel), cols = parseInt(wall.attr('cols')), 
        	    wallData = wall.attr('wallData'), scroller = $.query(wall.attr('relWrap')).scroller();
        	
        	$.cleanUpContent(wall.get(0), false, true);
        	wall.empty(); 
        	$.query(wall.attr('pageBar')).hide();
        	wall.css('height', wall.attr('initHeight')+'px'); 
        	wall.attr({'allLoaded':'n', 'isLoading':'n'});
        	scroller.scrollToTop(0);
        	if(wall.attr('masonry') == 'y') {
            	if(wallData){
            		wallData = eval(wallData);
            		wallData.wallRcds = [];
            	}
        		var padTop = parseFloat(wall.attr('wWallPad')), wTops = [];
        		for(var i=0; i < cols; i++) wTops[i] = padTop;
        		wall.data('wTops', wTops);
        	}
        	if(resetPage){
        		wall.attr('page', 1);
        		wall.attr('sPage', 0);
        	}
        	
        	else $.query(wall.attr('triggerBar')).html($.feed.loadMoreMsg).show(); //show to support pageBar
        	if($.ckj.cfg.useInfinite) scroller.clearInfinite();
        },
        
        loadData: function(wall, nPage, nSpage) {
            var allLoaded = wall.attr('allLoaded'), isLoading = wall.attr('isLoading'), 
                scroller = $.query(wall.attr('relWrap')).scroller(), noTriggerBar = wall.attr('noTriggerBar') == 'y';
            if(allLoaded == 'y' || isLoading == 'y') {
                if(allLoaded == 'y') {
                  if(scroller.refreshRunning) scroller.hideRefresh();
                  if($.ckj.cfg.useInfinite) scroller.clearInfinite();
                }

                return false;
            }
            
            if(!noTriggerBar) {
                var trigger = $.query(wall.attr('triggerBar')); 
                trigger.html($.feed.loadingMsg);
            }
            wall.attr('isLoading', 'y');
            //page spage initialized to 0
            if(nPage == 1 && nSpage == 1 && !!wall.attr('popTip')) {
            	$.vv.tip({icon:'loading', time:10000});
            	if(!noTriggerBar)trigger.hide();
            } else {
                if(!noTriggerBar) trigger.show();
            }
            
            var loadFunc = wall.attr('dataSrcFunc');
            if(loadFunc) {
            	loadFunc = eval(loadFunc); //just like ajax and the return data is the same as ajax returned
            	loadFunc({success:$.feed.handleRst, nPage:nPage, nSpage:nSpage});
            } else {
                var uri = wall.attr('dataUri'), url  = $.ckj.cfg.mapi+uri+"&p="+nPage+"&sp="+nSpage;
                
                $.ajax({
                    url: url,
                    data: {},
                    type: 'POST',
                    dataType: 'json',
                    success: function(rst){
                    	$.feed.handleRst(rst, wall, nPage, nSpage);
                    },
                    error: function(xhr, why) {
                        if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        if(!noTriggerBar) 
                            trigger.html( why == 'offline'|| why =='timeout' || 
                                          (nPage==1 && nSpage==1 && why == 'panelhided') ? $.feed.reloadMsg : $.feed.loadMoreMsg);
                        wall.attr('isLoading', 'n');
                        scroller.refreshRunning && scroller.hideRefresh();
                    }
                });
            }
        },
        
        handleRst:function(rst,wall,nPage,nSpage){
        	var  pagebar = $.query(wall.attr('pageBar')),
        	 	   scroller = $.query(wall.attr('relWrap')).scroller(),
               noTriggerBar = wall.attr('noTriggerBar') == 'y',
        	 	   noDataMsg = wall.attr('noDataMsg'),
        	 	   noMoreDataMsg = wall.attr('noMoreDataMsg');
        	if(!noTriggerBar) {
        	    var trigger = $.query(wall.attr('triggerBar'));
        	    //trigger.html($.feed.loadMoreMsg);
            } 
        	
        	if(rst.status == 0) {
        		var renderFunc = eval(wall.attr('renderFunc'));
             	var html = '';
             	
             	if(nPage == 1 && nSpage == 1 && !!wall.attr('popTip')) {
             	    $.vv.tip({close:true});
             	}
             	
             	if(rst.data.rlist.length < 1) {
             		wall.attr({'allLoaded':'y'});
             		if(!noTriggerBar) {
             		    if(nPage == 1) {
             		        if(nSpage == 1)trigger.html((noDataMsg ? noDataMsg : $.feed.noDataMsg)).show();//iphone infinite loading
             		        else trigger.html((noMoreDataMsg ? noMoreDataMsg : $.feed.noMoreDataMsg)).show();//iphone infinite loading
             		    } else trigger.hide(); //android paging
             		} 
             		
             		if(nPage == 1) {
             		    pagebar.hide();
             		} else { 
                        pagebar.show(); pagebar.find('.prev').css('visibility', 'visible'); 
             		    pagebar.find('.next').css('visibility', 'hidden');
             		}

             		if(scroller.refreshRunning) scroller.hideRefresh();
             		
             		if($.ckj.cfg.useInfinite) scroller.clearInfinite();
             	} else {
             	    //we get some valid records 
             	    
                 	html = $(renderFunc(rst.data, wall));
                 	if(wall.attr('insert') && wall.attr('insert') == 'prepend') wall.prepend(html);
                 	else wall.append(html);
             		
                 	wall.attr({'page':nPage, 'spage': nSpage}); //>>>paging:
                  	pagebar.find('.curpage').html(nPage+'/'+rst.data.pages);
                  	
                  	if(rst.data.last_subpage) { //page full(last sub page)
                  		if(rst.data.all_loaded) {
                  		    wall.attr({'allLoaded':'y'});
                  		    
                  		    if(!noTriggerBar){
                  		        if(nPage == 1) trigger.html((noMoreDataMsg ? noMoreDataMsg : $.feed.noMoreDataMsg)).show();
                  		        else trigger.hide();
                  		    }
                  		    
                  			if(nPage == 1) pagebar.hide();
                      		else { 
                      		    pagebar.show(); 
                      		    pagebar.find('.prev').css('visibility', 'visible'); 
                      		    pagebar.find('.next').css('visibility', 'hidden');
                      		}
                  		} else {
                  		    wall.attr({'allLoaded':'n'});
                  		    if(!noTriggerBar) trigger.hide();
                  			pagebar.show(); 
                  			pagebar.find('.switchpage').css('visibility', 'visible');
                  			if(nPage == 1) {pagebar.find('.prev').css('visibility', 'hidden');}
                  		}
                  		if(scroller.refreshRunning) scroller.hideRefresh();
                  	} else { //page not full
                  		if(rst.data.all_loaded){
                  		    wall.attr({'allLoaded':'y'});
                  		    
                  			if(!noTriggerBar){
                  			    if(nPage == 1) trigger.html((noMoreDataMsg ? noMoreDataMsg : $.feed.noMoreDataMsg)).show();
                                else trigger.hide();
                  			} 
                  			
                  			if(nPage == 1) { pagebar.hide();}
                            else { 
                                pagebar.show(); 
                                pagebar.find('.prev').css('visibility', 'visible'); 
                                pagebar.find('.next').css('visibility', 'hidden');
                            }
                            
                  			if(scroller.refreshRunning) scroller.hideRefresh();
                  			
                  		} else {
                  		    if(!noTriggerBar) trigger.html($.feed.loadMoreMsg).show();
                  		    wall.attr({'allLoaded':'n'});
                  		    pagebar.hide();
                  		}
                  	}
                 	
                 	if(wall.attr('even-height') && $.vv.needEvenHeight) {
                 	     $.feed.evenHeight(html, wall);
                 	}
                 	
                 	if(wall.attr('set-height')) {
                         $.feed.setHeight(html, wall);
                    }
                 	
                    if(wall.attr('masonry') == 'y') { 
                    	//$.feed.setImgWrapHtWdth(html.find(s.sizeUnit));
                        $.feed.masonry(html, wall, rst.data.last_subpage || rst.data.all_loaded);
                    } else {
                    	wall.css('height', 'auto'); //>>> must here because initHeight
                    }
                    
                    //html.find('.J_expr').faceReplace({imgsrc:'data-orig'}); //expression face trans:: must before the following statements; imgsrc: lazy load
                    //$.vv.ui.decodeImg(html);
                    //$.vv.ui.lazyloadImg(html); 
                    html.find('.J_highKeys').highKeys();
                }
            }else{
                $.vv.tip({icon:'error', content:rst.msg, time:3000});
                
                if(!noTriggerBar) {
                    trigger.html($.feed.reloadMsg);
                }
            }
            
        	wall.attr('isLoading', 'n'); //don't load when there is already trigger instance in progress
        	scroller.refreshRunning && scroller.hideRefresh();
        	if($.ckj.cfg.useInfinite) scroller.clearInfinite();
        	
        	if(wall.attr('finishFunc')) {
        	    var finishFunc = eval(wall.attr('finishFunc'));
        	    finishFunc();
        	} 
        },
        
        //android < 4.4 has the border-width bug with odd height item
        evenHeight: function(wDatas, wall){
            if(wDatas.length < 1) return;
            var tmpHeight = 0, tRcd=null;
            $.each(wDatas, function(idx, rcd){
                if(rcd.nodeType != 1) return;
                tRcd = $(rcd);
                tmpHeight = parseInt(tRcd.height());
                if(tmpHeight % 2 != 0) tRcd.height(tmpHeight+1);
            });
        },
        
        //android < 4.4 has the border-width bug with odd height item
        setHeight: function(wDatas, wall){
            if(wDatas.length < 1) return;
            var tRcd=null;
            $.each(wDatas, function(idx, rcd){
                if(rcd.nodeType != 1) return;
                tRcd = $(rcd);
                tRcd.height(tRcd.height());
            });
        },
        
        masonry: function(wDatas, wall, delta){
        	//$.vv.log('wDatas.length::'+wDatas.length);
        	if(wDatas.length < 1) return;
        	var wRcdWd = parseFloat(wall.attr('wRcdWd')), wOffX = parseFloat(wall.attr('wOffX')),
        		wOffY = parseFloat(wall.attr('wOffY')), wWallPad = parseFloat(wall.attr('wWallPad')), 
        		wTops = wall.data('wTops'), wallData = eval(wall.attr('wallData')), wallRcds = wallData ? wallData.wallRcds : null;
        	var wWdth = wRcdWd + wOffX, tmpHeight=0, minIdx =0;
        	$.each(wDatas, function(idx, rcd){
        		if(rcd.nodeType != 1) return;
        		minIdx = wTops.indexOf(Math.min.apply(Math, wTops)); //find the min top col index
        		$(rcd).css({width: wRcdWd});
        		tmpHeight = rcd.offsetHeight + wOffY;
        		$(rcd).css({top:wTops[minIdx] + 'px', left: ((wWdth * minIdx)+wWallPad) + 'px', position:'absolute'});
        		wallRcds && wallRcds.push({hide:false, node:rcd, top:wTops[minIdx]});
        		wTops[minIdx] += tmpHeight;
        	});
        	wall.css('height', Math.max.apply(Math, wTops) + 'px');
        	if(delta){
        		if(wall.attr('delta') && wall.attr('delta') === 'n') return;
        		var deltaHt = Math.abs(Math.max.apply(Math, wTops) - Math.min.apply(Math, wTops)) - wOffY;
        		if(deltaHt < 10) return;
        		minIdx = wTops.indexOf(Math.min.apply(Math, wTops)); 
        		var ele = $('<div class="'+wall.attr('feedRcd')+' feed_delta cfx" style="height:'+deltaHt+'px; width:' + wRcdWd+'px;">&nbsp;</div>').appendTo(wall);
        		ele.css({top:wTops[minIdx] + 'px', left: ((wWdth * minIdx) + wWallPad) + 'px', position:'absolute'});
        	}
        	
        	wall.data('wTops', wTops);
        },
        
        reMasonry:function(wallSel){
        	var wall = $.query(wallSel), cols = parseInt(wall.attr('cols')), wallData = wall.attr('wallData');
        	if(wall.attr('masonry') == 'y') {
            	if(wallData){
            		wallData = eval(wallData);
            		wallData.wallRcds = [];
            	}
        		var padTop = parseFloat(wall.attr('wWallPad')), wTops = [];
        		for(var i=0; i < cols; i++) wTops[i] = padTop;
        		wall.data('wTops', wTops);
        	}
        	$.feed.masonry(wall.find('.'+wall.attr('feedRcd')), wall);
        	wall = null;
        }
    };
})(af);
