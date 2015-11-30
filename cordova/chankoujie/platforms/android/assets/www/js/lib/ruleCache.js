// reg rules for validation
function RuleCache(ruleObj)
{
	this.cache 	 = ruleObj;	
	this.getRule = function(eid) {
		return this.cache[eid];
	};	
	this.setCache = function(ruleObj) {
		this.cache = ruleObj;
	};
	this.registerEvent = function(mode) {
		if(this.cache != null) {
			for(var eid in this.cache) {
				var rule = this.cache[eid];
				var eventName = rule['eventName'];
				
				if(eventName != '') RuleCache.myAttachEvent(eid, eventName, this , mode);
			}
		}
	};
}

/**
 * cus  customize this func
 */
RuleCache.removeChildren = function (eid)
{
	var node = document.getElementById(eid);
	
	if(node) {
		var pnode = node.parentNode;
		if(pnode)pnode.removeChild(node);
	}
}

/**
 * append a text after this node 
 * @we should customize this func
 */
RuleCache.appendTextNode = function (eid, text, cls)
{
	var node = document.getElementById(eid);
	RuleCache.removeChildren(eid + "AppendErrorMsg");
	var pnode = node.parentNode;
	var cnode = document.createElement("p");
	cnode.setAttribute("class", cls);
	cnode.id = eid + "AppendErrorMsg";
	var textNode = document.createTextNode(" " + text);
	cnode.appendChild(textNode);
	pnode.appendChild(cnode);
}

RuleCache.myAttachEvent = function (eid , eventName, rc, mode)
{
	var obj = document.getElementById(eid);
	if(!obj)return;
	if(window.addEventListener) obj.addEventListener(eventName, function(){RuleCache.checkInputText(eid, rc, mode);}, false);
	else obj.attachEvent('on' + eventName, function(){RuleCache.checkInputText(eid, rc, mode);}); 
}

// if error return error msg, if OK, return empty string
RuleCache.validate = function (rule , content)
{
	var flage = true;
	var reg = rule.reg;

	if(reg != "" && reg+'' != '.' ) flage = reg.test(content)? true : false; 
	if(rule.maxLength > 0)flage = flage ? content.length <= rule.maxLength : false;
	if(rule.minLength > 0)flage = flage ? content.length >= rule.minLength : false;
	return flage ? '':rule.msg;
}

// text input validation
RuleCache.checkInputText = function (srcEle , rc, mode)
{	
	if(srcEle.readOnly || srcEle.disabled) return true; 
	// just name
	var eid = srcEle;
	var rule          = rc.getRule(eid);
	var node        = document.getElementById(eid);
	if(!node)return true;
	if(node.readOnly || node.disabled) return true; 
	var msg = RuleCache.validate(rule, node.value);
	
	if(msg == '' || node.getAttribute('rule_check') == 'n') {
		if(mode != 'pop') RuleCache.removeChildren(eid + "AppendErrorMsg");
		return true;
	} else {	// 
		if(mode == 'pop') alert(msg); 
		else  RuleCache.appendTextNode(eid, msg , 'errorMsg'); 
		return false;
	}
}

// validate form eles
RuleCache.checkForm = function (rc, func) {
	var rst = true;
	if(rc != null) {
		for(var eid in rc.cache) {
			var rule = rc.getRule(eid);
			var obj = document.getElementById(eid);
			
			if(!obj)continue;
			if(rule.eventName != '') {
				if(document.all) obj.fireEvent("on" + rule.eventName); 
				else {// firefox
			         	var evtObj = document.createEvent('MouseEvents'); 
			         	evtObj.initMouseEvent(rule.eventName,true,true,document.defaultView,1,0,0,0,0,false,false,true,false,0,null);   
			            obj.dispatchEvent(evtObj);
		    	}
		    	if(document.getElementById(eid + "AppendErrorMsg")) rst = false; 
    		}
		}
	}
	if(func != null) rst = func() ? (rst ? true : false) : false; 
	return rst;
}

// validate form,  alert the error
RuleCache.checkFormAlert = function (rc, func) {
	var rst = true;
	if(rc != null) {
		for(var eid in rc.cache) {
			rst	= RuleCache.checkInputText(eid,rc,'pop');
			if(rst)continue;
			else return false;
		}
	}
	if(func != null) return (func() ? true : false); 
	return true;
}

/**
 * remove all the nodes after this
 */
RuleCache.removeAppendChildren = function (node)
{
	var pnode = node.parentNode;
	var nodes = pnode.childNodes;
	var f = false;
	if(nodes != null && nodes.length >0) {
		for(var i = 0 ;i < nodes.length ; i++) {
			if(nodes[i] == node) {
				f = true;
				continue;
			} if(f) {
				pnode.removeChild(nodes[i]);
			}
		}
	}
}

/**
 * set values for the page form eles
 */
RuleCache.setValues = function (vs){
	if(vs != null){
		for(var eid in vs){
			var node = document.getElementById(eid);
			if(node != null && node.type!="file"){
				node.value = vs[eid];
			}
		}
	}
}

/**
 * added:hjc echo the error mesage
 */
RuleCache.setErrors = function setErrors(errors) {
	if(errors != null) {
		for(var eid in errors) {
			var node 		= document.getElementById(eid);
			if(node != null && node.type!="file") {
				var errorArr	= errors[eid];
				if(errorArr['result'] == 'false') RuleCache.appendTextNode(eid, errorArr['msg'], 'errorMsg'); 
			}
		}
	}
}

/**
 * process elment's error msg,for any type element
 */
RuleCache.elementErr = function (srcElement , msg , result) {	
	if(result == true) RuleCache.removeAppendChildren(srcElement); 
	else RuleCache.appendTextNode(srcElement.id, msg , 'errorMsg');
}
