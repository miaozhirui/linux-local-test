(function($){
    $.rstMap = {
        cfg: {
            id:0,
            panelInited:false,
        },
        bMap: null,
        tgtPoint: {},
        init: function() {
            $("#rstrnt_map").bind("loadpanel",function(e) {
                if(e.data.goBack)return;
                $.query('#J_rstmap_tabs a').removeClass('cur');
                $.rstMap.panelInit();
                var params = $.query("#rstrnt_map").data('params');
                $.ui.setTitle($.vv.util.equalSubStr(decodeURIComponent(params[0]), 6, '...')+'地图');
                
                            
                if(!BMap){
                    $.vv.tip({icon:'loading', time:30});
                    $.ckj.loadBMapApi();
                }
                
                var testLoop = 0 ;
                _ldBdLoop();
                function _ldBdLoop(){
                    testLoop++;
                    $.vv.log('=======_showInMap Loop:: '+testLoop);
                    if(!BMap) {
                        clearTimeout($.rstMap.loadMapTimver);
                        $.rstMap.loadMapTimver = null;
                        $.rstMap.loadMapTimver = setTimeout(_ldBdLoop, 200); //>>> wait for baiduApi load Complete ...
                    }
                    else {
                        $.vv.tip({close:true});
                        BMap.Convertor = {};
                        BMap.Convertor.translate = $.rstMap.transGeoSys;
                        $.rstMap.tgtPoint = $.geoCord.mars2baidu(params[1]/1000000, params[2]/1000000);
                        $.rstMap.render();
                        if($.rstMap.tgtPoint[0] < 5 || $.rstMap.tgtPoint[1] < 5){
                            $.vv.tip({content:'该餐馆无地理定位信息'});
                        };
                    }
                }
            });
            
            $("#rstrnt_map").bind("unloadpanel",function(e) {
                clearTimeout($.rstMap.loadMapTimver);
                $.rstMap.loadMapTimver = null;
            });
        },
        panelInit: function(){
            if( $.rstMap.cfg.panelInited === true ) return;
            $.loadJS('./js/lib/geocord.js');
            
            $.rstMap.queryBus();
            $.rstMap.queryDrive();
            $.rstMap.queryWalk();
            
            $.rstMap.cfg.panelInited = true;
        },
        render:function(){
            var ggPoint = new BMap.Point($.vv.util.strDecode($.query('#J_rstlng').val()), $.vv.util.strDecode($.query('#J_rstlat').val())); 
            BMap.Convertor.translate(ggPoint,2, $.rstMap.mars2BaiduCb);
        },
        transGeoSys:function(point,type,callback){
            var callbackName = 'cbk_' + Math.round(Math.random() * 10000); 
            var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from="+ type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
            BMap.Convertor[callbackName] = function(xyResult,xyURL){
                delete BMap.Convertor[callbackName];  
                var point = new BMap.Point(xyResult.x, xyResult.y);
            }
            callback && callback(point);
        },
        mars2BaiduCb:function(point){
        	var lnglat = point;
            $.rstMap.bMap = new BMap.Map("J_rstmap_box");
            var map = $.rstMap.bMap;
            //map.enableScrollWheelZoom(true);
            var bdpoint = new BMap.Point($.rstMap.tgtPoint[0], $.rstMap.tgtPoint[1]); 
            map.centerAndZoom(bdpoint, 16); 
            map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(5, 5)}));    
            var marker = new BMap.Marker(bdpoint);  
            map.addOverlay(marker);
            //add my position
            if($.ckj.cfg.gpsPos.lng) {
            	if($.rstMap.myMarker)map.removeOverlay($.rstMap.myMarker);
                var bPoint = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
	                myIcon = new BMap.Icon("./img/mypos.gif", new BMap.Size(20, 24), {anchor: new BMap.Size(11, 30)}),
	                myMarker = new BMap.Marker(bPoint, {icon: myIcon});
                	$.rstMap.myMarker = myMarker;
                $.rstMap.bMap.addOverlay(myMarker);
            }
            //locate my position
            var curtime = Math.round(new Date().getTime()/1000);//unit:second
            if($.vv.cfg.debug || !$.ckj.cfg.gpsPos.lastTime || $.ckj.cfg.gpsPos.errmsg || (curtime - $.ckj.cfg.gpsPos.lastTime) > 120)$.rstMap.gpsLocate();
            else {$.rstMap.gpsMapOKCb()};
        },
        gpsLocate:function() {
        	if(!$.ckj.cfg.hasNET){ return false; }
        	$.geoCord.getGeoCord($.rstMap.gpsMapOKCb,$.rstMap.gpsMapErrCb,$.rstMap.gpsErrCb);
        },
        gpsErrCb:function(){ return;},
        gpsMapOKCb:function(position) {
            //alert('我的位置'+$.ckj.cfg.gpsPos.error);
            return;
            if(!$.ckj.cfg.gpsPos.error) {
            	var map = $.rstMap.bMap;
            	if($.rstMap.myMarker)map.removeOverlay($.rstMap.myMarker);
                var bPoint = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
	                myIcon = new BMap.Icon("./img/mypos.gif", new BMap.Size(20, 24), {anchor: new BMap.Size(11, 30)}),
	                myMarker = new BMap.Marker(bPoint, {icon: myIcon});
                	$.rstMap.myMarker = myMarker;
                $.rstMap.bMap.addOverlay(myMarker);
                //console.log(point.lng + "," + point.lat);
            } else {
                //console.log($.ckj.cfg.gpsPos.error);
            }
            
        },
        gpsMapErrCb:function(error){
        	return;
        },
        queryBus:function(){
            $.query('#J_rstmap_bus').on('click', function(){
                var self = $(this);
                self.closest('.border_tabs').find('a').removeClass('cur');
                self.addClass('cur');
                if($.ckj.cfg.gpsPos.lng){
                    var map = $.rstMap.bMap,
                    p1 = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
                    p2 = new BMap.Point($.rstMap.tgtPoint[0], $.rstMap.tgtPoint[1]),
                    transit = new BMap.TransitRoute(map, {
                            renderOptions: { map: map}, 
                            onSearchComplete: function(result) {
                                $.vv.tip({close:true});
                                //console.log('============query bus result:: ', result, transit.getStatus(), BMAP_STATUS_SUCCESS);
                                if (transit.getStatus() != BMAP_STATUS_SUCCESS) {  
                                    $.vv.tip({content:'没有查询到相关公交信息', icon:'error', ctx:'#J_rstmap_box'});
                                }  
                            } 
                    });
                    map.clearOverlays();
                    $.vv.tip({icon:'loading'});
                    transit.search(p1, p2);
                } else {
                    $.vv.tip({content:'没有定位信息，不能查询！', icon:'error'});
                }
            });
        },
        queryDrive:function(){
            $.query('#J_rstmap_drive').on('click', function(){
                var self = $(this);
                self.closest('.border_tabs').find('a').removeClass('cur');
                self.addClass('cur');
                if($.ckj.cfg.gpsPos.lng){
                    var map = $.rstMap.bMap,
                    p1 = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
                    p2 = new BMap.Point($.rstMap.tgtPoint[0], $.rstMap.tgtPoint[1]),
                    transit = new BMap.DrivingRoute(map, {
                        renderOptions: {map: map, autoViewport: true},
                        onSearchComplete: function(result) {  
                            $.vv.tip({close:true});
                            if (transit.getStatus() != BMAP_STATUS_SUCCESS) {  
                                $.vv.tip({content:'没有查询到驾车路线', icon:'error', ctx:'#J_rstmap_box'});
                            }  
                        } 
                    });
                    map.clearOverlays();
                    $.vv.tip({icon:'loading'});
                    transit.search(p1, p2);
                } else {
                    $.vv.tip({content:'没有定位信息，不能查询！', icon:'error'});
                }
            });
        },
        queryWalk:function(){
            $.query('#J_rstmap_walk').on('click', function(){
                var self = $(this);
                self.closest('.border_tabs').find('a').removeClass('cur');
                self.addClass('cur');
                if($.ckj.cfg.gpsPos.lng){
                    var map = $.rstMap.bMap,
                    p1 = new BMap.Point($.ckj.cfg.gpsPos.lng, $.ckj.cfg.gpsPos.lat),
                    p2 = new BMap.Point($.rstMap.tgtPoint[0], $.rstMap.tgtPoint[1]),
                    transit = new BMap.WalkingRoute(map, {
                        renderOptions: {map: map},
                        onSearchComplete: function(result) {  
                            $.vv.tip({close:true});
                            if (transit.getStatus() != BMAP_STATUS_SUCCESS) {  
                                $.vv.tip({content:'没有查询到步行路线', icon:'error', ctx:'#J_rstmap_box'});
                            }  
                        } 
                    });
                    map.clearOverlays();
                    $.vv.tip({icon:'loading'});
                    transit.search(p1, p2);
                } else {
                    $.vv.tip({content:'没有定位信息，不能查询！', icon:'error'});
                }
            });
        }
    };
    $.rstMap.init();
})(af);
