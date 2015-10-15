var orgin = "";
var showPost = function(obj,e) {
	var href = obj && obj.href;
	var hash = (href && href.substring(href.indexOf("#"))) || location.hash;
	var $node;
	if($node = document.getElementById(hash)) {
		if(orgin) {
			document.getElementById(orgin).style.display = "none";
		}
		else {
			// ...JS CODE
		}
		document.getElementById(hash).style.display = "block";
		orgin = hash;
	} else {
		//...JS CODE
	}
}
var tagLoad = function() {
	if (location.hash) {
		showPost(null);	
	} 
	else {
		//...JS CODE
	}
}

addLoadEvent(tagLoad);
