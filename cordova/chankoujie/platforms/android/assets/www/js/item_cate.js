(function($) {
    $.itemCate = {
        cfg: {
        	panelInited:false,
        	catesLoaded:false
        },
        
        init: function(options) {
        	$("#item_cate").bind("loadpanel", function(e) {
        		if(e.data.goBack)return;
        		$.itemCate.panelInit();
        		if(!$.itemCate.cfg.catesLoaded) $.query('#J_item_c_p li[t="item_cate"]').trigger('click'); //>>> init tap
        	});
        },
        panelInit: function(){
        	if( $.itemCate.cfg.panelInited === true ) return;
        	
        	if($.os.android && $.os.androidVersion < 4.4) {
               var cpW = $('#J_item_c_p_wrap').width();
               if(parseInt(cpW)%2 != 0) {
                   $('#J_item_c_p_wrap').css('width', (cpW+1)+'px');
                   $('#J_item_c_s_wrap').css('width', ($('#J_item_c_s_wrap').width()-1)+'px');
               }
            } else {
                $.query("#J_item_c_p").scroller({
                verticalScroll: true,
                hasParent:true,
                useJsScroll:true
                });
            }
            
        	$.query("#J_item_c_s").scroller({
        	    scrollBars: false,
        	    hasParent:true,
        	    useJsScroll:true
        	});
        	
            $.itemCate.selectCate();
            $.itemCate.selectSubCate();
        	$.itemCate.cfg.panelInited = true;
        },
        selectCate: function(){
        	$.query('#J_item_c_p').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		var $this = $(this);
        		var t = $this.attr('t');
        		var wrap = $.query('#J_item_c_s_wrap');
        		//switch tab
        		$.query('#J_item_c_p li').removeClass('on');
        		$this.addClass('on');
        		$.query('#J_item_c_s').empty();
        		//switch son cates parent css
        		wrap.removeClass('cson hson nson');
        		if(t == 'hot') wrap.addClass('hson');
        		else if(t == 'new') wrap.addClass('nson');
        		else wrap.addClass('cson');
        		
        		$.itemCate.loadCates(t, 0);
        		//if item cate, then find the get the second level cates;
        		if(t=='item_cate') wrap.attr('getsub', 'y');
        		else wrap.attr('getsub', 'n');
        		$.query('#J_item_c_s_wrap').attr('type', t);
        	});
        },
        selectSubCate: function(){
        	$.query('#J_item_c_s_wrap').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		var wrap = $.query('#J_item_c_s_wrap'),
        		    $this 	= $(this),
        		    t 	= wrap.attr('type'),
        		    cid = $this.attr('cid'),
        		    cname = '',
        		    getsub = wrap.attr('getsub');
        		
        		if(t == 'hot' || t == 'new') {
        		    cname = $this.text();
        		} else {
        		    cname = $this.next('p').text();
        		}
        		
        		if(getsub == 'y') {
        			//item_cate need to show second level cates
        			$.query('#J_item_c_s').empty();
        			$.itemCate.loadCates(t, cid);
        			$.query('#J_item_c_s_wrap').attr('getsub', 'n');
        		} else {
        			$.ui.loadContent('#item_book/'+t+'/'+cid+'/'+cname, false, false);
        		}
        	});
        },
        loadCates: function(type, cid) {
        	cid = cid || 0;
        	//1:from cache
        	var ckey = (type == 'hot' || type == 'new') ? 'item_'+type+'_reccates' : 'item_'+type+'_cates_'+cid, cates = $.vv.ls.get(ckey);
        	if(cates) { showCates(cates, type); return true;}
        	
        	//2: from server
        	var act = 'get_cates';
        	if(type == 'hot' || type == 'new') act= type+"_cates";
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=item_cate&a='+act+'&t='+type+'&cid='+cid,
                success: function(rst){
                	$.vv.tip({close:true});
                	if(rst.status != 0){$.vv.tip({content:rst.msg, icon:'error'}); return false;};
                	showCates(rst.data, type);
                	$.vv.ls.set(ckey, rst.data, (type == 'hot' || type == 'new') ? $.ckj.cacheTime.itemHotNewCate : $.ckj.cacheTime.itemCate); //cache chtml
                	$.itemCate.cfg.catesLoaded = true;
                },
                dataType: "json"
            });
        	
        	function showCates(cates, type){
        		var chtml = $.itemCate.renderCates(cates, type);
            	$.query("#J_item_c_s").html(chtml).scroller().scrollToTop();
        	}
        },
        renderCates: function(cates, type) {
        	if(!cates) return '';
        	var html   = '';
        	var tmptpl = '';
        	var k=1;
        	if(type == 'new' || type == 'hot') {
        		$.each(cates, function(idx, cate) {
        			//responsive adjust
        			var cname = cate['name'].substring(0,2) + '<br>' + cate['name'].substring(2);
            		tmptpl = '<a cid='+cate['id']+'>'+cname+'</a>';
            		if(k%3 == 0) html += '<li class="right">'+tmptpl+'</li>'; 
            		else html += '<li>' +tmptpl+ '</li>'; 
            		k++;
            	});
        	} else {
        		$.each(cates, function(idx, cate) {
            		tmptpl = '<div class="dummy"></div>\
        		              <a cid='+cate['id']+'>\
        		                  <img src="'+cate['img']+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>\
        		              </a>\
            		         <p class="cname">'+cate['name']+'</p>';
            		html += '<li>' +tmptpl+ '</li>'; 
            	});
        	}
        	
        	return html;
        }
    };

    $.itemCate.init();
    
})(af);
