(function($) {
    $.rstBook = {
    	cfg: {
    		panelInited:false,
        	switchCity:true,
        	preferPrvn:'', //#rstrnt_addr/rstrnt_book will set this when go back/gps location
        	preferCity:'', //#rstrnt_addr/rstrnt_book will set this when go back/gps location
        	curBookCity:'',
        	schKey:'', //#rstrnt_search will set this when go back
        	
        	//show in map params
    		mapPage:0, //cur page
    		allRstLoaded:false
    	},
    	bMap:null,
        wallData:{
        	wallRcds:[]
        },
        count:0,
        init: function(options){
        	$("#rstrnt_book").bind("loadpanel",function(e) {
        		$.rstBook.panelInit();
                if(!$.ckj.cfg.gpsPos.city) {
                	$.ckj.cfg.gpsPos = $.vv.ls.get('user_gps_pos');
                	if(!$.ckj.cfg.gpsPos)$.ckj.cfg.gpsPos={city:''};
                }
        		
                if(!$.rstBook.cfg.preferPrvn) $.rstBook.cfg.preferPrvn = $.vv.ls.get('cur_rstbook_prvn');
        		if(!$.rstBook.cfg.preferCity) $.rstBook.cfg.preferCity = $.vv.ls.get('cur_rstbook_city');
        		if(!$.rstBook.cfg.preferPrvn) $.rstBook.cfg.preferPrvn = $.vv.cfg.debug ? '江苏' : '';
        		if(!$.rstBook.cfg.preferCity) $.rstBook.cfg.preferCity = $.vv.cfg.debug ? '南京' : '深圳';
        		
        		//$.vv.log('======> cur_rstbook_city::'+$.rstBook.cfg.preferCity+' =====>gpsPos::'+ JSON.stringify($.ckj.cfg.gpsPos));
        		
        		if($.rstBook.cfg.schKey)$.ui.setTitle("'"+$.rstBook.cfg.schKey+"'"+'相关餐馆'); //params[1]: search keyword
        		else $.ui.setTitle('发现餐馆'); 
        		
        		var wall = $.query('#J_rstrnt_wall');
        		$.vv.ls.set('cur_rstbook_prvn', $.rstBook.cfg.preferPrvn);
        		if($.rstBook.cfg.curBookCity == $.rstBook.cfg.preferCity && $.rstBook.cfg.schKey == wall.attr('schKey')) {
        		    if(wall.find('.wall_rstrnt').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
        			    $.ckj.showHideWallRcds($.rstBook.wallData.wallRcds, '#J_rstrnt_wall');
        			    return;
        		    }
        		} else if($.rstBook.cfg.curBookCity == $.rstBook.cfg.preferCity && $.rstBook.cfg.schKey != wall.attr('schKey')) {
        			wall.attr({'schKey': $.rstBook.cfg.schKey});
        			$.rstBook.resetMap(true);
                	$.feed.resetWall('#J_rstrnt_wall', true);
                	$.rstBook.loadRstrnts(); //load asap...
                	return;
        		} else {
        			$.vv.ls.set('cur_rstbook_city', $.rstBook.cfg.preferCity);
        			$.rstBook.cfg.curBookCity = $.rstBook.cfg.preferCity;
        		}
        		
        		wall.attr({'curAid':$.rstBook.cfg.preferCity, 'schKey': $.rstBook.cfg.schKey});
        		$.feed.resetWall('#J_rstrnt_wall', true);
        		
                var curtime = Math.round(new Date().getTime()/1000);//unit:second
                if($.vv.cfg.debug || !$.ckj.cfg.gpsPos.lastTime || (curtime - $.ckj.cfg.gpsPos.lastTime) > 120){ $.rstBook.locateMyPos();}
                else {
                    setTimeout(function(){$.rstBook.gpsRstOKCb();}, 300); //splash hided by panel switch on ios 
                }
                
                $.rstBook.loadAddrs($.rstBook.cfg.preferCity, 3); //asynchronous call
                
                $.query('#J_rstbook_curcity span').text($.rstBook.cfg.preferCity);

    		});
        	
        	$.query("#rstrnt_book").bind('unloadpanel', function() {
        		$.ckj.hideWallRcds($.rstBook.wallData.wallRcds, Math.abs($.query('#J_rstrnt_wall_wrap').scroller().scrollTop));
        		$.rstBook.cfg.schKey = '';
    		});
        },
        panelInit:function() {
        	if($.rstBook.cfg.panelInited === true) return;
        	//load BaiduMap
        	$.loadJS('./js/lib/geocord.js');
        	$.ckj.loadBMapApi();
        	
        	//init scroller
			$.query("#J_rstbook_addrs3, #J_rstbook_addrs4").scroller({scrollBars: false, vScrollCSS: "afScrollbar", hasParent:true, useJsScroll:true});
        	var wallWrap = $.query("#J_rstrnt_wall_wrap"), wall = $.query('#J_rstrnt_wall'), padding=0;
    		padding = 0;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-170, 'lng':'', 'lat':'', sort:''});
        	
        	$.feed.init('#J_rstrnt_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
            
            if($.ckj.cfg.useInfinite) {
                scroller.addInfinite();
                $.bind(scroller, "infinite-scroll", function () {
                    $.asap(function(r){
                        if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                            $.query(wall.attr('pageBar')).css('display') != 'none') return;
                        $.query(wall.attr('triggerBar')).trigger('click');
                    }, null, []);
                });
            }
            
        	//rstbook_optabs event bind
        	$.query('#rstrnt_book .rstbook_optabs').on('click', 'li', function(e){
        		e.stopPropagation(); e.preventDefault();
        		var $this = $(this);
        		var id = $this.attr('id');
        		
        		$.query('#rstrnt_book .rstbook_optabs li').removeClass('tapped').find('.fa').removeClass('fa-rotate-270');
        		$.query('#rstrnt_book .J_op_panel').hide();
        		
        		if(id == 'J_rstbook_disp') {
        			if($this.attr('mapshowed') == 'n'){
        				$.rstBook.resetMap();
        				$this.attr('mapshowed', 'y').addClass('tapped');
        				$.vv.tip({icon:'loading', time:100000});
        	    		$('#J_rstinmap_box, #J_rstinmap_nav').show(); //>>> $.query('#J_rstinmap_box') must use absolute positioned
        	        	if(!BMap)$.ckj.loadBMapApi();
        	        	var testLoop = 0 ;
        	        	_showInMap();
        	        	function _showInMap(){
        	        		testLoop++;
        	        		//$.vv.log('=======_showInMap Loop:: '+testLoop);
        	        		if(!BMap) setTimeout(_showInMap, 200); //>>> wait for baiduApi load Complete ...
        	        		else {
        	        			$.vv.tip({close:true});
        	        			$.rstBook.showInMap();
        	        		}
        	        	}
        			} else {
                		$this.attr('mapshowed', 'n').removeClass('tapped');
                		$('#J_rstinmap_box, #J_rstinmap_nav').hide();
        			}
        			return true;
        		}
        		
        		//toggle show
                if($this.attr('showed') == 'y'){
                    $this.attr('showed', 'n');
                    return false;
                } else {
                	$.query('#rstrnt_book .rstbook_optabs li').attr('showed', 'n');
                	$this.attr('showed', 'y').find('.fa').addClass('fa-rotate-270');
                }
                
        		//add new style
        		$this.addClass('tapped');
        		$.query('#'+id+'_ops').show();
        	});
        	
        	//J_rstbook_order_ops event bind
            $.query('#J_rstbook_order_ops').on('click', 'li', function(e){
            	e.stopPropagation();e.preventDefault();
                var wall = $.query('#J_rstrnt_wall'), $this = $(this), sort=$this.attr('sort');
            	wall.attr('sort', sort);
            	$.rstBook.resetMap(true);
            	$.feed.resetWall('#J_rstrnt_wall', true);
            	$.rstBook.loadRstrnts();
            	
                $.query('#J_rstbook_order_ops li').removeClass('cur');
                $this.addClass('cur');
                $.query('#J_rstbook_order span').html($this.text());
                //reset style
                $.query('#J_rstbook_order').trigger('click');
            });
            
            //J_rstbook_addrs3 event bind
            $.query('#J_rstbook_addrs3').on('click', 'li', function(e){
            	e.stopPropagation();e.preventDefault();
                $.query('#J_rstbook_addrs3 li.cur').removeClass('cur');
                var $this = $(this), html4='';
                $this.addClass('cur');
                var all_aid = $this.attr('all_aid');
                $.query('#J_rstbook_addrs4').scroller().scrollToTop(0); //>>> must use this, or will ...
                if(all_aid){
                	html4 = '<li aid='+all_aid+'>全部商圈<i class="fa fa-check"></i></li>';
                	$.query('#J_rstbook_addrs4').html(html4);
                }else if($this.attr('nearby') == 'y'){
                	html4 = $.rstBook.renderNearBy();
                	$.query('#J_rstbook_addrs4').html(html4);
                }else{
                	var aid = $this.attr('aid');
                	$.rstBook.loadAddrs(aid, 4, $this.text()); //asynchronous call
                }
            });
            
            //J_rstbook_addrs4 event bind
            $.query('#J_rstbook_addrs4').on('click', 'li', function(e){
            	e.stopPropagation();e.preventDefault();
            	var wall = $.query('#J_rstrnt_wall'), $this = $(this), args={};
            	if($this.attr('near')){
            		$('#J_rstbook_order_ops li[sort=dist]').show();
            		args.curAid = $.query('#J_rstbook_addrs3 li[all_aid]').attr('all_aid');
            		args.lng = $.ckj.cfg.gpsPos.lng; args.lat = $.ckj.cfg.gpsPos.lat; args.sort=''; args.near = $this.attr('near');
            	} else {
            		$('#J_rstbook_order_ops li[sort=dist]').hide();
            		args.curAid = $this.attr('aid'); args.lng = ''; args.lat = ''; args.sort='', args.near='';
            	}
            	$.query('#J_rstbook_order span').html('排序');
            	$.query('#J_rstbook_order_ops li').removeClass('cur');
            	wall.attr(args);
            	$.rstBook.resetMap(true);
            	$.feed.resetWall('#J_rstrnt_wall', true);
            	$.rstBook.loadRstrnts(); //load asap...

                $.query('#J_rstbook_addrs4 li').removeClass('cur');
                $this.addClass('cur');
                $.query('#J_rstbook_addr span').html($this.text());
                //reset style
                if($.query('#J_rstbook_addr').attr('showed') == 'y') $.query('#J_rstbook_addr').trigger('click');
            });
            
            //gps location
            $.query('#J_rstbook_gpsaddr').bind('click', function(e){
            	e.stopPropagation();e.preventDefault();
            	$.ui.popup( {
         	        title:'<i class="fa fa-map-marker"></i>定位到我的位置',
         	        message:'定位到您的当前位置，可以查找身边附近的餐馆哦~',
         	        cancelText:"取消",
         	        doneText:($.ckj.cfg.gpsPos && $.ckj.cfg.gpsPos.city)? "重新定位" : '开始定位',
         	        cancelClass:'button',
                    doneClass:'button',
                    cancelCallback: null,
         	        doneCallback: function () {$.rstBook.locateMyPos(true);},
         	        supressFooter:false,
         	        blockUI:true,
            	});
            });
            
            $.vv.ui.onPressed('#J_rstbook_curcity_wrap');
            
            $.rstBook.cfg.panelInited = true;
        },
        reset:function(){
        	$.query('#rstrnt_book .rstbook_optabs li').removeClass('tapped');
    		$.query('#rstrnt_book .J_op_panel').hide();
    		$.query('#J_rstbook_addrs3').empty();
    		$.query('#J_rstbook_addrs4').empty();
        },
        resetMap:function(hide){
        	$('#J_mapLastPage, #J_mapNextPage').removeClass('gray');
        	$.rstBook.cfg.allRstLoaded 	= false;
        	$.rstBook.cfg.mapPage = 0;
        	
        	if(hide && $.query('#J_rstbook_disp').attr('mapshowed') == 'y') {
        		$.query('#J_rstbook_disp').attr('mapshowed', 'n').removeClass('tapped');
        		$('#J_rstinmap_box, #J_rstinmap_nav').hide();
        	}
        },
        locateMyPos:function(manual){
        	if(!$.ckj.cfg.gpsPos.city){
        		$.query('#J_rstbook_gpsaddr').html('<i class="fa fa-info"></i>尚未定位！');
        	} else {
        		var addr = $.ckj.cfg.gpsPos.province + ' ' + $.ckj.cfg.gpsPos.city + ' ' + $.ckj.cfg.gpsPos.district;
        		if($.vv.cfg.debug || $.ckj.cfg.gpsPos.accuracy < 500) addr = addr + ' ' + $.ckj.cfg.gpsPos.street;
        		//if($.vv.cfg.debug)addr = addr.trim()+'(精度:'+parseInt($.ckj.cfg.gpsPos.accuracy)+'米)';
        		addr = addr.trim();
        		$.query('#J_rstbook_gpsaddr').html('<i class="fa fa-map-marker"></i>' + addr);
        	}
        	
        	if(!$.ckj.cfg.hasNET && manual){
        		$.vv.tip({icon:'error', content:'哦哦，当前还没有网络哦！', time:3000}); return false;
        	} else if(!$.ckj.cfg.hasNET) {
        		return false;
        	}
        	
        	$.query('#J_rstbook_gpsaddr').html('<i class="fa fa-spinner fa-spin" style="font-size:14px; position:relative; top:2px; margin-right:2px;"></i>定位中...');
        	
        	if(!BMap)$.ckj.loadBMapApi();
        	var testLoop = 0 ;
        	_getGeoCord();
        	function _getGeoCord(){
        		testLoop++;
        		//$.vv.log('=======_getGeoCord Loop:: '+testLoop);
        		if(!BMap) setTimeout(_getGeoCord, 200); //>>> wait for baiduApi load Complete ...
        		else $.geoCord.getGeoCord($.rstBook.gpsRstOKCb, $.rstBook.gpsRstErrCb, $.rstBook.gpsErrCb);
        	}
        },
        gpsErrCb:function(){
        	$.query('#J_rstbook_gpsaddr').html('<i class="fa fa-warning orange"></i>设备不支持地理定位');
        },
        gpsRstOKCb:function(){    	
        	if($.ckj.cfg.gpsPos.city){
        		var addr = $.ckj.cfg.gpsPos.province + ' ' + $.ckj.cfg.gpsPos.city + ' ' + $.ckj.cfg.gpsPos.district;
        		if($.vv.cfg.debug || $.ckj.cfg.gpsPos.accuracy < 500) addr = addr + ' ' + $.ckj.cfg.gpsPos.street;
        		//if($.vv.cfg.debug)addr = addr.trim()+'(精度:'+parseInt($.ckj.cfg.gpsPos.accuracy)+'米)';
        		addr = '<i class="fa fa-map-marker"></i>'+addr.trim();
        		$.vv.ls.set('user_gps_pos', $.ckj.cfg.gpsPos);
        	}
        	else 
        		var addr = '<i class="fa fa-warning orange"></i>尚无定位信息';
        	//$.vv.log(' gpsRstOKCb city::'+$.ckj.cfg.gpsPos.city, ' localstorage gpspos::', $.vv.ls.get('user_gps_pos'));
        	$.query('#J_rstbook_gpsaddr').html(addr);
        	//$.vv.log('$.rstBook.cfg.switchCity::'+$.rstBook.cfg.switchCity+' $.ckj.cfg.gpsPos.city::'+$.ckj.cfg.gpsPos.city+' $.rstBook.cfg.preferCity::'+$.rstBook.cfg.preferCity);
        	$.rstBook.count++;
        	//$.vv.log('=======gpsRstOKCb count:: '+$.rstBook.count);
        	if($.ui.activeDiv.id == 'rstrnt_book' && $.rstBook.cfg.switchCity && ($.ckj.cfg.gpsPos.city != $.rstBook.cfg.preferCity)) {
            	$.ui.popup({
         	        title:'切换城市',
         	        message:'您当前所在城市为['+$.ckj.cfg.gpsPos.city+']， 需要切换到当前城市么？',
         	        cancelText:"取消",
         	        doneText:'切换',
         	        cancelClass:'button',
                    doneClass:'button',
                    cancelCallback: function () {$.rstBook.cfg.switchCity = false;},
         	        doneCallback: function () {
         	        	$.vv.ls.set('cur_rstbook_city', $.ckj.cfg.gpsPos.city);
         	        	$.vv.ls.set('cur_rstbook_prvn', $.ckj.cfg.gpsPos.province);
         	        	$.rstBook.cfg.preferCity 	= $.ckj.cfg.gpsPos.city;
         	        	$.rstBook.cfg.curBookCity 	= $.rstBook.cfg.preferCity;
         	        	var args = {};
         	        	args.curAid = $.rstBook.cfg.preferCity; args.lng = ''; args.lat = ''; args.sort='', args.near='';
         	        	$.query('#J_rstrnt_wall').attr(args);
         	        	$.rstBook.resetMap(true);
         	        	$.feed.resetWall('#J_rstrnt_wall', true);
         	        	$.rstBook.loadAddrs($.rstBook.cfg.preferCity, 3); //asynchronous call
         	        	$.query('#J_rstbook_curcity span').text($.rstBook.cfg.preferCity);
         	        },
         	        supressFooter:false,
         	        blockUI:true,
            	});
        	}
        },
        gpsRstErrCb:function(errMsg){
			//$.query('#J_rstbook_gpsaddr').html('<i class="fa fa-warning orange"></i>'+errMsg); //iOS always timeout except first time
			$.vv.log(errMsg);
        },
        loadAddrs: function(addr, level, aname){ //addr is aid or addr   	
        	//1:from cache
        	var skey = 'rstaddr_'+$.vv.util.strEncode('a'+addr+'b')+'_sons', addrData = $.vv.ls.get(skey);
        	if(addrData){ 
        		_showAddrs(addrData, addr, level, aname);
        		return true;
        	}
        	if(level != 3) $.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=rstrnt_addr&a=get_addrs&aid='+addr,
                success: function(rst){
                	$.vv.tip({close:true});
                	if(rst.status != 0){$.vv.tip({content:rst.msg, icon: 'error'}); return false;};
                	$.vv.ls.set(skey, rst);
                	_showAddrs(rst, addr, level, aname);
                },
                dataType: "json"
            });

        	function _showAddrs(rst, addr, level, aname){
        		//$.vv.log('_showAddrs::'+addr+' gpscity::'+$.ckj.cfg.gpsPos.city);
            	var html3 = '', html4='';
            	if( level==3 ){ //panel onload: addr = addrname
            		html3 = $.rstBook.renderAddrs3(rst.data.addrs);
            		if($.ckj.cfg.gpsPos && addr == $.ckj.cfg.gpsPos.city){
            			html3 = '<li nearby="y" class="cur">附近</li><li all_aid='+rst.data.all_aid+' >全部商圈</li>'+html3;
            			html4 = $.rstBook.renderNearBy();
            		} else {
            			html3 = '<li class="cur" all_aid='+rst.data.all_aid+' >全部商圈</li>'+html3;
            			html4 = '<li aid='+rst.data.all_aid+'>全部商圈<i class="fa fa-check"></i></li>';
            		}
                	$.query('#J_rstbook_addrs3').html(html3).scroller().scrollToTop(0); //>>> must use this, or will ...
                	$.query('#J_rstbook_addrs4').html(html4).scroller().scrollToTop(0); //>>> must use this, or will ...
                	$.query('#J_rstbook_addrs4 li:first-child').trigger('click');
            	} else {
            		rst.data.addrs.unshift({id:addr, name:aname});
            		html4 = $.rstBook.renderAddrs4(rst.data.addrs);
                	$.query('#J_rstbook_addrs4').html(html4).scroller().scrollToTop(0); //>>> must use this, or will ...
            	}
        	}
        },
        
        renderAddrs3: function(addrs){
        	if(!addrs) return '';
        	var html   = '';
        	if(addrs.length > 0){
        		$.each(addrs, function(idx, a){
        			html += '<li aid="'+a.id+'">'+a.name+'</li>';
            	});
        	}
        	return html;
        },
        
        renderAddrs4: function(addrs){
        	//$.vv.log('=======renderAddrs4 addrs:: ',addrs);
        	if(!addrs) return '';
        	var html   = '';
        	if(addrs.length > 0){
        		$.each(addrs, function(idx, a){
        			html += '<li aid="'+a.id+'">'+a.name+'<i class="fa fa-check"></i></li>';
            	});
        	}
        	return html;
        },
        renderNearBy: function(){
        	return '<li near="500">附近500米<i class="fa fa-check"></i></li>\
        			<li near="2000">附近2000米<i class="fa fa-check"></i></li>\
        			<li near="5000">附近5000米<i class="fa fa-check"></i></li>';
        },
        loadRstrnts: function() {
        	var wall = $.query('#J_rstrnt_wall'), 
        		aid = wall.attr('curAid'), q=wall.attr('schKey'), sort=wall.attr('sort'), lat=wall.attr('lat'), lng=wall.attr('lng'), near=wall.attr('near');
        	var uri  =  '/?m=rstrnt&a=book&aid='+aid+'&q='+q+'&lng='+lng+'&lat='+lat+'&near='+near+'&sort='+sort;
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        showInMap:function(){
    		var map = $.rstBook.bMap, s = $.rstBook.cfg;
    		if(!map){
    			$.rstBook.bMap = new BMap.Map("J_rstinmap", {enableMapClick: false});
    			map = $.rstBook.bMap;
    			
    			$.query('#J_locate_mine').on('click', function(){
    				if($.ckj.cfg.gpsPos.lng){
    	            	if($.rstBook.myMarker)map.removeOverlay($.rstBook.myMarker);
    	                var point = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
    		                myIcon = new BMap.Icon("./img/mypos.gif", new BMap.Size(20, 24), {anchor: new BMap.Size(11, 30)}),
    		                myMarker = new BMap.Marker(point, {icon: myIcon});
    	                	$.rstBook.myMarker = myMarker;
    	                $.rstBook.bMap.addOverlay(myMarker);
	        			if(0 && BMap.Label){
	        				//var label = new BMap.Label("我的当前位置(精度:"+parseInt($.ckj.cfg.gpsPos.accuracy)+"米)",{offset:new BMap.Size(20,-10)});
	        				var label = new BMap.Label("我的当前位置",{offset:new BMap.Size(20,-10)});
		             	    marker.setLabel(label); //
	        			}
	             	    map.centerAndZoom(point, 16);
    				} else {
    					$.vv.tip({content:$.ckj.cfg.gpsPos.err, icon:'error'});
    				}
    			});
    			$.query('#J_refresh_map').on('click', function(){
    				var $this = $(this);
    				$this.addClass('fa-spin');
    				map.clearOverlays();
    				s.allRstLoaded 	= false;
    				s.mapPage 		= 0;
    				$('#J_curRcds').html('');
    				$.rstBook.loadMapRsts();
    				$this.removeClass('fa-spin');
    			});
    			
    			$.query('#J_mapLastPage').on('click', function(){ $.rstBook.loadMapRsts('lst');});
    			$.query('#J_mapNextPage').on('click', function(){ $.rstBook.loadMapRsts();});
    		}
    		$.rstBook.loadMapRsts();
        },
        loadMapRsts: function(nxtlst){
        	var map = $.rstBook.bMap, s = $.rstBook.cfg;
        	nxtlst = nxtlst ? nxtlst : 'nxt';
        	var qpage = 0;
        	if(nxtlst == 'nxt') qpage = s.mapPage+1;
        	else qpage = s.mapPage - 1;
        	
        	if(s.mapPage < 2) {
        		$('#J_mapLastPage').addClass('gray');  		
        		if(nxtlst == 'lst'){
        			$.vv.tip({content:'当前已经是第一页！', icon:'info'});
        			return;
        		}
        	}
        	
        	if(s.allRstLoaded == true && nxtlst == 'nxt'){
        		$.vv.tip({content:'已经全部加载完毕！', icon:'info'});
        		$('#J_mapNextPage').addClass('gray');
    			return;
        	}
        	
    		var wall = $.query('#J_rstrnt_wall'),
    			url  = $.ckj.cfg.mapi+'/?m=rstrnt&a=book&aid='+wall.attr('curAid')+'&q='+wall.attr('schKey')+'&near='+wall.attr('near')
    				   +'&lng='+wall.attr('lng')+'&lat='+wall.attr('lat')+'&sort='+wall.attr('sort')+'&map=1&p='+qpage;
    		$.vv.tip({icon:'loading'});
        	$.ajax({
                url: url,
                type:'get',
                success: function(r){
                	$.vv.tip({close:true});
                	//console.log(result);
                	if(r.status != 0){ //error happened
                		$.vv.tip({content:'系统繁忙，请稍后重试！', icon:'error'});
                	} else {
                		if(nxtlst == 'nxt') s.mapPage += 1;
                		else s.mapPage -= 1;
                		var p = r.data.p, count=r.data.count, rstList = r.data.rlist, pageSize = parseInt(r.data.pageSize),
                			allLoaded = r.data.all_loaded, pages = r.data.pages;
                		if(rstList.length < 1) {
                			$.vv.tip({content:'没有更多餐馆了！', icon:'error'});
                			s.allRstLoaded = true;
                			$('#J_mapNextPage').addClass('gray');
                			return;
                		}
                		if(allLoaded){
                			s.allRstLoaded = true;
                			$('#J_mapNextPage').addClass('gray');
                		}
                		if(s.mapPage > 1) $('#J_mapLastPage').removeClass('gray');
                		else $('#J_mapLastPage').addClass('gray');
                		if(nxtlst == 'lst'){s.allRstLoaded =false; $('#J_mapNextPage').removeClass('gray');};
                		//console.log(p, pageSize);
                		//$.vv.log(p, pageSize, rstList.length);
                		var curRcds = ((p-1) * pageSize) + '-' + (((p-1) * pageSize) + rstList.length);
                		$('#J_curRcds').html(curRcds);
    					
                		var firstRst = rstList[0],
            				bdPoint = $.geoCord.mars2baidu(firstRst.lng/1000000, firstRst.lat/1000000),
            				point = new BMap.Point(bdPoint[0], bdPoint[1]);
                		map.centerAndZoom(point, 15);
                		map.clearOverlays();
                		$.each(rstList, function(idx, r){
                			$.rstBook.addRstMaker(r);
                		});
                		
                		if($.ckj.cfg.gpsPos.lng){
        	            	if($.rstBook.myMarker)map.removeOverlay($.rstBook.myMarker);
        	                var point = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
        		                myIcon = new BMap.Icon("./img/mypos.gif", new BMap.Size(20, 24), {anchor: new BMap.Size(11, 30)}),
        		                myMarker = new BMap.Marker(point, {icon: myIcon});
        	                	$.rstBook.myMarker = myMarker;
        	                $.rstBook.bMap.addOverlay(myMarker);
							if(0 && BMap.Label){
								//var label = new BMap.Label("我的当前位置(精度:"+parseInt($.ckj.cfg.gpsPos.accuracy)+"米)",{offset:new BMap.Size(20,-10)});
								var label = new BMap.Label("我的当前位置",{offset:new BMap.Size(20,-10)});
								marker.setLabel(label); //
							}
                		}
                	}
                },
                dataType: "json",
                timeout:10000,
                error:function(xhr, err) {
                	if(err == 'timeout')$.vv.tip({ content:'抱歉，服务器繁忙，请稍后再试!', icon:'error'});
                	else $.vv.tip({ content:'抱歉，网络异常，请稍后再试!', icon:'error'});
                }
           });
        },
        addRstMaker: function(r){
			var rname = r.name + (r.branch.trim() ? '<span style="font-size:14px;">('+r.branch+')</span>' : '' ),
				rhref = '/rstrnt/'+r['id'];
			var sCnt = '<div class="map_rstrcd">\
			                <div class="top">\
			                    <a onclick="$.ui.loadContent(\'#rstrnt_detail/'+r.id+'\',false,false,\'none\');" class="title ofh">'+rname+'↗</a>\
			                    <p class="other">\
			                        <span><i class="fa fa-heart-o"></i>' + r['likes'] + '</span>\
			                        <span><i class="fa fa-comment-o"></i>' + r['comments'] + '</span>\
			                        <span class="cost"><i class="head">人均: </i><i class="val">' + (r['cost']>0 ? '￥ '+r['cost']: '未知') +'</i></span>\
			                    </p>\
			                </div>\
			                <div class="bottom">\
			                        <p class="cfx">\
			                        	<span class="head">地址:</span><span>' + r['street_addr'] + (r['near'] ? '('+r['near']+')' : '')+'</span>\
			                        </p>';
						if(r['suits'])
							sCnt+= '<p class="ofh"><span class="head">适合:</span><span class="green">' + r['suits']  + ' </span></p>';
						if(r['features'])
							sCnt+= '<p class="ofh"><span class="head">特色:</span><span class="green">' + r['features']  + ' </span></p>';
						if(r['extsrvs'])
							sCnt+= '<p class="ofh"><span class="head">额外服务:</span><span class="green">' + r['extsrvs']  + ' </span></p>';
					sCnt+=  '</div>\
		            	</div>'; 
			var bdPoint = $.geoCord.mars2baidu(r.lng/1000000, r.lat/1000000),
				point = new BMap.Point(bdPoint[0], bdPoint[1]),
				marker = new BMap.Marker(point),
				infoWindow = new BMap.InfoWindow(sCnt, {enableMessage:false, 'width':$.vv.cfg.cWidth*0.7, enableAutoPan:true});  // 创建信息窗口对象
			$.rstBook.bMap.addOverlay(marker);
			marker.addEventListener("click", function(){          
			   this.openInfoWindow(infoWindow);
			});
        },
    };    
    $.rstBook.init();
})(af);
