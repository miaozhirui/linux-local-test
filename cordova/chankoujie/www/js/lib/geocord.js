(function($){
    $.geoCord = {
		pi:3.14159265358979324,
		a:6378245.0,
		ee:0.00669342162296594323,
		watchId:null,
		
		clearWatch:function(){
	        if($.geoCord.watchId){
                if($.os.ios) navigator.geolocation.clearWatch($.geoCord.watchId);
                else window.locationService.stop(null, null); //Android use Baidu Location SDK
                $.geoCord.watchId = null;
            }
		},
		getGeoCord:function(geoRstOKCb, geoRstErrCb, noGeoErrCb){
		    $.geoCord.clearWatch();
		    
		    if($.os.ios) { //use Webview Geolocation
		        if (navigator.geolocation) {
                    //$.vv.log('======locate start=====');
                    $.geoCord.watchId = navigator.geolocation.watchPosition(
                        function(position){
                            //$.vv.log('======locate OK=====');
                            $.geoCord.locateOK(position, geoRstOKCb);
                        }, 
                        function(error){
                            //$.vv.log('======locate error=====');
                            $.geoCord.locateErr(error, geoRstErrCb);
                        },
                        {              
                            enableHighAccuracy: true, //use GPS first
                            timeout: 120000, //unit: ms
                            maximumAge: 30000
                        }
                    );
                } else {
                    devNoLocationErr(noGeoErrCb);
                }
		    } else { //use Baidu SDK Location
                if (window.locationService) {
                    //$.vv.log('======locate start=====');
                    $.geoCord.watchId = 110;
                    
                    window.locationService.getCurrentPosition(
                        function(position){
                            //$.vv.log('======locate OK=====');
                            $.geoCord.locateOK(position, geoRstOKCb);
                        },
                        function(error){
                            //$.vv.log('======locate error=====');
                            $.geoCord.locateErr(error, geoRstErrCb);
                        }
                    );                    
                } else {
                    devNoLocationErr(noGeoErrCb);
                }
		    }
		    
		    function devNoLocationErr(noGeoErrCb){
                $.ckj.cfg.gpsPos.lastTime = Math.round(new Date().getTime()/1000);
                $.ckj.cfg.gpsPos.error = "您的设备不支持地理定位！";
                if(!noGeoErrCb) {
                    //$.vv.log('======device no gps error=====');
                    $.vv.tip({content:"您的设备不支持地理定位！", icon: 'info'});
                }
                else noGeoErrCb();
		    }
		},
		locateOK:function(position, okCb) {
			//$.vv.log('======locate OK end=====');
			$.geoCord.clearWatch();
			/*
			if($.geoCord.watchTimes > 10){
				$.geoCord.watchTimes = 0;
				navigator.geolocation.clearWatch($.geoCord.watchId);
			}
			*/
			if($.os.ios) {
                //$.vv.log('wgs::'+position.coords.longitude+','+position.coords.latitude);
                //$.vv.log('wgs::'+position.coords.longitude+'#'+position.coords.latitude);
                var isMarsGeo = navigator.userAgent.indexOf('UCBrowser') > 0 || navigator.userAgent.indexOf('MQQBrowser') > 0;//for UC browser and QQ browser
                if(!isMarsGeo) var marsCord = $.geoCord.wgs2mars(position.coords.longitude, position.coords.latitude);
                else var marsCord = [position.coords.longitude, position.coords.latitude];
                //$.vv.log('mars::'+marsCord[0]+'#'+marsCord[1]);//>>>
                var bdCord   = $.geoCord.mars2baidu(marsCord[0], marsCord[1]);//baidu geocord
			} else {
			    var bdCord   = [position.coords.longitude, position.coords.latitude];//BaiduSdk return baidu geocord
			}

			//$.vv.log('baidu::'+bdCord[0]+'#'+bdCord[1]);//>>>
		    
		    $.ckj.cfg.gpsPos = $.ckj.cfg.gpsPos || {};
		    $.ckj.cfg.gpsPos.lng = bdCord[0];
		    $.ckj.cfg.gpsPos.lat = bdCord[1];
		    $.ckj.cfg.gpsPos.accuracy = $.os.ios ? parseInt(position.coords.accuracy) : parseInt(numOnly(position.coords.radius));
		    $.ckj.cfg.gpsPos.lastTime = Math.round(new Date().getTime()/1000);//unit:second
		    $.ckj.cfg.gpsPos.error = ''; //clear error info
		    //get location info
		    var gc = new BMap.Geocoder();    
	        gc.getLocation(new BMap.Point(bdCord[0], bdCord[1]), function(rs){
	            var addComp = rs.addressComponents;
	            $.ckj.cfg.gpsPos.province 	= addComp.province.replace(/\s*([^\s]*)省\s*$/gi, "$1");
	            $.ckj.cfg.gpsPos.city  =  addComp.city.replace(/\s*([^\s]*)市\s*$/gi, "$1");
	            $.ckj.cfg.gpsPos.district 	= addComp.district;
	            $.ckj.cfg.gpsPos.street = addComp.street;
	            $.ckj.cfg.gpsPos.streetNumber = addComp.streetNumber;
	            if(okCb)okCb(position);
	        });
		},
		locateErr:function(error, errCb){
			$.geoCord.clearWatch();
			$.ckj.cfg.gpsPos.lastTime = Math.round(new Date().getTime()/1000);
			var errMsg = '';
			//$.vv.log('======locate Err end====='+error.code);
			//$.vv.log(error);
			switch(error.code) {
		        case PositionError.TIMEOUT:
		        	errMsg = "定位超时，请稍后重试！"; break;
		        case PositionError.POSITION_UNAVAILABLE:
		        	errMsg = "不能定位，请在[定位服务]设置中配置允许GPS和网络定位！"; break;
		        case PositionError.PERMISSION_DENIED:
		            errMsg = "您已经禁止程序地理位置信息"; break;
		        default:
		            errMsg = "未知错误";
		    }
			$.ckj.cfg.gpsPos.error = errMsg;
			//$.vv.log('======locate Err end====='+errMsg);
			if(!errCb) $.vv.tip({content:errMsg, icon: 'error'});
			else  {
			    errCb(errMsg);
			}
		},
    	wgs2mars: function (wgLon, wgLat) {
    		if ($.geoCord.outOfChina(wgLon, wgLat)) return [wgLon, wgLat];
    		//ep("wgLon === wgLat");
    		var dLat = $.geoCord.transformLat(wgLon - 105.0, wgLat - 35.0);
    		var dLon = $.geoCord.transformLon(wgLon - 105.0, wgLat - 35.0);
    		var radLat = wgLat / 180.0 * $.geoCord.pi;
    		var magic 	= Math.sin(radLat);
    		magic 	= 1 - $.geoCord.ee * magic * magic;
    		var sqrtMagic = Math.sqrt(magic);
    		dLat = (dLat * 180.0) / (($.geoCord.a * (1 - $.geoCord.ee)) / (magic * sqrtMagic) * $.geoCord.pi);
    		dLon = (dLon * 180.0) / ($.geoCord.a / sqrtMagic * Math.cos(radLat) * $.geoCord.pi);
    		var mgLat = wgLat + dLat;
    		var mgLon = wgLon + dLon;
    		
    		return [mgLon, mgLat];
    	},
    	mars2baidu:function mars2baidu(x, y) {
    		var x_pi = $.geoCord.pi * 3000.0 / 180.0;
    		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    		var bd_lon = z * Math.cos(theta) + 0.0065;
    		var bd_lat = z * Math.sin(theta) + 0.006;

    		return [bd_lon, bd_lat];
    	},
    	transformLat: function(x, y) {
    		var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    		ret += (20.0 * Math.sin(6.0 * x * $.geoCord.pi) + 20.0 * Math.sin(2.0 * x * $.geoCord.pi)) * 2.0 / 3.0;
    		ret += (20.0 * Math.sin(y * $.geoCord.pi) + 40.0 * Math.sin(y / 3.0 * $.geoCord.pi)) * 2.0 / 3.0;
    		ret += (160.0 * Math.sin(y / 12.0 * $.geoCord.pi) + 320 * Math.sin(y * $.geoCord.pi / 30.0)) * 2.0 / 3.0;
    		return ret;
    	},
    	transformLon: function (x, y) {
    		var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    		ret += (20.0 * Math.sin(6.0 * x * $.geoCord.pi) + 20.0 * Math.sin(2.0 * x * $.geoCord.pi)) * 2.0 / 3.0;
    		ret += (20.0 * Math.sin(x * $.geoCord.pi) + 40.0 * Math.sin(x / 3.0 * $.geoCord.pi)) * 2.0 / 3.0;
    		ret += (150.0 * Math.sin(x / 12.0 * $.geoCord.pi) + 300.0 * Math.sin(x / 30.0 * $.geoCord.pi)) * 2.0 / 3.0;
    		return ret;
    	},
    	outOfChina: function(lon, lat) {
    		if (lon < 72.004 || lon > 137.8347) return true;
    		if (lat < 0.8293 || lat > 55.8271) return true;
    		return false;
    	},
    	lngLatDist: function (lat1,lng1,lat2,lng2){
    	    var EARTH_RADIUS = 6378137.0;    //单位M
    	    var PI = Math.PI;
            
            function getRad(d){
    	        return d*PI/180.0;
    	    }
            
            var f = getRad((lat1 + lat2)/2), g = getRad((lat1 - lat2)/2), l = getRad((lng1 - lng2)/2),
            	sg = Math.sin(g), sl = Math.sin(l), sf = Math.sin(f),
            	s,c,w,r,d,h1,h2, a = EARTH_RADIUS, fl = 1/298.257;
            
            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;
            
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            
            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        }
    };
})(af);