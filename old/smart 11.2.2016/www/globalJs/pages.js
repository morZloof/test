var pages = new pagesJS()
function pagesJS (){
	$(document).ready(function(){
		ctor();
		function ctor(){
			var url = window.location.hash;
			var url = url.split("#").pop()
			pages(url);
		}
	})
	
	$(window).on('hashchange', function() {
		var url = window.location.hash;
		var url = url.split("#")[1];
		pages(url);
	});
	
	function pages(page){
		// if(page=="dashboard"){
	}
	this.pages = pages;
}