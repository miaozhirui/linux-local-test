(function($){
    $.stuffCate = {
        cfg: {panelInited:false},
        
        init: function(options){
        	$("#stuff_cate").bind("loadpanel",function(e){
        		if(e.data.goBack)return;
        		$.stuffCate.panelInit();
        		//load Item
        		$.stuffCate.loadCates();
    		});
        },
        
        panelInit: function(){
        	if( $.stuffCate.cfg.panelInited === true ) return;
        	$.query("#J_stuff_c").scroller({verticalScroll: true, hasParent:true, useJsScroll:true});
        	$.stuffCate.cfg.panelInited = true;
        },
        
        loadCates: function(){
        	var ckey = 'stuff_tcates', cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates); return true; }
        	
        	$.vv.tip({time:0, icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=stuff_cate&a=get_cates',
                success: function(rst){
                	$.vv.tip({close:true});
                	if(rst.status != 0){$.vv.tip({ content:rst.msg}); return false;};
                	showCates(rst.data);
            		$.vv.ls.set(ckey, rst.data, $.ckj.cacheTime.stuffCate);
                },
                dataType: "json",
                timeout:$.ckj.cfg.timeOut
            });
        	
        	function showCates(cates){
        		var chtml = $.stuffCate.renderCates(cates);
        		$.query('#J_stuff_c').html(chtml);
        	}
        },
        
        renderCates: function(cates, type) {
        	if(!cates) return '';
        	var html   = '';
        	var tmptpl = '';

    		$.each(cates, function(idx, c) {
        		tmptpl = '<a href="#stuff_book/'+c.id+'/'+c.name+'" ><img src="'+c.img+'"  onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" /></a><p class="cname">'+c.name+'</p>';
        		html += '<li>' +tmptpl+ '</li>'; 
        	});
        	
        	return html;
        }
    };
    
    $.stuffCate.init();
})(af);