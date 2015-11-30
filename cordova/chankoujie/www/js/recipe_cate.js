//JS loaded after panel view
(function($) {
    $.recipeCate = {
        cfg: {
        	panelInited:false,
        	cateInited:false,
        },
        
        //executed after JS loaded which is loaded after related panel view loaded 
        init: function(options){
        	$("#recipe_cate").bind("loadpanel", function(e) {    
        	    $.recipeCate.panelInit();		
        		//cate select event
        		$.query('#recipe_cate').on('click', '#J_recipe_c_p li', function(e){
                    e.stopPropagation();e.preventDefault();
                    var  $this = $(this),
                         type = $this.attr('t');
                    //switch tab
                    $.query('#J_recipe_c_p li').removeClass('on');
                    $this.addClass('on');
                    $.query('#J_recipe_c_s').empty();
                    $.recipeCate.loadCates(type);
                });
                
        		if(e.data.goBack){
                    if($.recipeCate.cfg.cateInited) return;
                }
                  
        		if( !$.recipeCate.cfg.cateInited ){
                    $.query('#J_recipe_c_p li[t="series"]').trigger('click');
                }
        		
        		$.query('#header h1').attr('scrollTgt', '');
    		});
    		
    	    $("#recipe_cate").bind("unloadpanel", function(e) {
                $.query('#recipe_cate').off('click', '#J_recipe_c_p li');
            });
        },

        //called by init function
        panelInit: function(){
            //alert(window.devicePixelRatio);
        	if( $.recipeCate.cfg.panelInited === true ) return;
        	
        	if($.os.android && $.os.androidVersion < 4.4) {
               var cpW = $('#J_recipe_c_p_wrap').width();
               if(parseInt(cpW)%2 != 0) {
                   $('#J_recipe_c_p_wrap').css('width', (cpW+1)+'px');
                   $('#J_recipe_c_s_wrap').css('width', ($('#J_recipe_c_s_wrap').width()-1)+'px');
               }
            }
        	
        	$.query("#J_recipe_c_p").scroller({
        	    verticalScroll: true,
        	    hasParent:true,
        	    useJsScroll:true
        	});
        	
        	$.query("#J_recipe_c_s").scroller({
        	    verticalScroll: true,
        	    hasParent:true,
        	    useJsScroll:true
        	});
        	
        	$.recipeCate.cfg.panelInited = true;
        },
        
        loadCates: function(type) {
        	//1: from cache
        	var ckey = 'recipe_'+type+'_cates', cates = $.vv.ls.get(ckey);
        	if(cates) { showCates(cates, type); return true;}

        	//2: from server
        	$.vv.tip({icon:'loading'});
        	var act = 'get_cates';
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=recipe_cate&a='+act+'&t='+type,
                success: function(rst){
                	$.vv.tip({close:true});
                	if(rst.status != 0){$.vv.tip({ content:rst.msg}); return false;};
                	showCates(rst.data, type);
                	$.vv.ls.set(ckey, rst.data, $.ckj.cacheTime.recipeCate); //cache chtml
                },
                dataType: "json"
            });
        	
        	function showCates(cates, type) {
        		var chtml = $.recipeCate.renderCates(cates, type);
            	$.query("#J_recipe_c_s").html(chtml).scroller().scrollToTop(); //>>> must use this, or will ...
        	}
        },
        
        renderCates: function(cates,type){
        	if(!cates) return '';
        	var html   = '';
        		$.each(cates, function(idx, cate){
        			html += '<a data-dpressed="true" href="#recipe_book/'+type+'/'+cate.id+'/'+cate.name+'" >'+cate.name+'</a>';
            	});
            $.recipeCate.cfg.cateInited = true;
        	return html;
        },
    };
    
    $.recipeCate.init();
})(af);
