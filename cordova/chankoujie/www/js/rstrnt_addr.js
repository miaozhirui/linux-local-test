(function($){
    $.rstrntAddr = {
    	cfg:{
    		panelInited:false
    	},
        init: function(options){
        	$("#rstrnt_addr").bind("loadpanel",function(e) {
        		$.rstrntAddr.panelInit();
        		if($.ckj.cfg.gpsPos.city)$.query('#J_rst_gps_city e').text($.ckj.cfg.gpsPos.city);
        		else $.query('#J_rst_gps_city e').text('未知');
        		$('#J_rst_hotcity a').removeClass('cur');
            	if($.rstBook.cfg.preferCity) {
            		var hc = $('#J_rst_hotcity *[nm='+$.rstBook.cfg.preferCity+']').get(0);
            		if(hc){
            			var offLeft = hc.offsetLeft + 50, cWidth = $.vv.cfg.cWidth, delta = offLeft - cWidth, md = {x:0, y:0};
            			if(delta > 0) md.x = -delta;
            			else md.x = 0;
            			$('#J_rst_hotcity').scroller().scrollTo(md, 0);
            			$(hc).addClass('cur');
            		}
            	}

            	$.query('#J_rstaddr1 i').removeClass('cur');
            	if($.rstBook.cfg.preferPrvn){
            		$.query('#J_rstaddr1 i[nm*='+$.rstBook.cfg.preferPrvn+']').trigger('click', true); //>>> init tap
            	} else {
            		$.query('#J_rstaddr1 i:first-child').trigger('click', true); //>>> init tap
            	}
    		});
        },
        panelInit:function() {
        	if($.rstrntAddr.cfg.panelInited === true) return;
        	$.query("#J_rst_hotcity").scroller({verticalScroll:false, horizontalScroll:true, hasParent:true, useJsScroll:true});
        	$.query("#J_rstaddr1, #J_rstaddr2").scroller({verticalScroll: true, hasParent:true, useJsScroll:true});
        	$.rstrntAddr.selectAddr();
            $.rstrntAddr.cfg.panelInited = true;
        },
        selectAddr: function(){
        	$.query('#J_rstaddr1').on('click', 'i', function(e, scrollto){
        		var $this = $(this);
        		e.stopPropagation();e.preventDefault();
        		$.rstrntAddr.loadAddrs($this.attr('aid')); //asynchronous call， exec asap
        		$.query('#J_rstaddr1 i').removeClass('cur');
        		$this.addClass('cur');
        		
        		//scroll intro view
        		if(scrollto) {
	        		var tp = this, offTop = tp.offsetTop + 35, cHeight = $.query('#rstaddr_wrap1').get(0).clientHeight, 
	    				delta = offTop - cHeight, md = {x:0, y:0};
	    			if(delta > 0) md.y = -delta;
	    			else md.y = 0;
	    			$('#J_rstaddr1').scroller().scrollTo(md, 0);
        		}
        	});
        	$.query('#J_rst_hotcity').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
        		if($(this).attr('pnm')) {
        			$.rstBook.cfg.preferPrvn = $(this).attr('pnm').trim();
        		} else $.rstBook.cfg.preferPrvn = '';
        		$.rstBook.cfg.preferCity = $(this).text().trim();
        		$.ui.goBack();
        	});
        	$.query('#J_rst_gps_city').on('click', function(e){
        		e.stopPropagation();e.preventDefault();
        		var gpsAddr = $(this).find('e').text().trim();
        		if(gpsAddr && gpsAddr != '未知'){
        			$.rstBook.cfg.preferCity = $.ckj.cfg.gpsPos.city;
        			$.rstBook.cfg.preferPrvn = $.ckj.cfg.gpsPos.province; 
        			$.ui.goBack();
        		}
        		return false;
        	});
        	$.query('#J_rstaddr2').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
        		$.rstBook.cfg.preferPrvn = $('#J_rstaddr1 i.cur').text().trim();
        		$.rstBook.cfg.preferCity = $(this).text().trim();
        		$.ui.goBack();
        	});
        },
        
        loadAddrs: function(aid){
        	//1:from cache
        	var skey = 'rstaddr_'+$.vv.util.strEncode('a'+aid+'b')+'_sons', addrData = $.vv.ls.get(skey);
        	if(addrData){_showAddrs(addrData); return true;}
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=rstrnt_addr&a=get_addrs&aid='+aid,
                success: function(rst){
                	$.vv.tip({close:true});
                	if(rst.status != 0){$.vv.tip({content:rst.msg}); return false;};
                	
                	$.vv.ls.set(skey, rst);
                	_showAddrs(rst);
                },
                dataType: "json"
            });
        	
        	function _showAddrs(addrData){
        		var html = $.rstrntAddr.renderAddrs(addrData.data.addrs);
            	$.query("#J_rstaddr2").html(html).scroller().scrollToTop();
        		var tc = $.query('#J_rstaddr2 a[nm*='+$.rstBook.cfg.preferCity+']').get(0);
        		if(tc) {
            		//scroll intro view
            		var offTop = tc.offsetTop + 35, cHeight = $.query('#rstaddr_wrap2').get(0).clientHeight, 
        				delta = offTop - cHeight, md = {x:0, y:0};
        			if(delta > 0) md.y = -delta;
        			else md.y = 0;
        			$('#J_rstaddr2').scroller().scrollTo(md, 0);
        			$(tc).addClass('cur');
        		}
        	}
        },
        
        renderAddrs: function(addrs){
        	if(!addrs) return '';
        	var html   = '';
        	if(addrs.length > 0){
        		$.each(addrs, function(idx, addr){
        			html += '<a nm="'+addr.name+'"  data-dpressed="true">'+addr.name+'<i class="fa fa-angle-right"></i></a>';
            	});
        	}
        	return html;
        },
    };
    
    $.rstrntAddr.init();
})(af);
