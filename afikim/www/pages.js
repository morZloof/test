var pages = new pagesJS()
function pagesJS (){
	$(document).ready(function(){
		constractor();
		function constractor(){
			var url = window.location.hash;
			var url = url.split("#")[1];
			pages(url);
		}	
	})
	
	$(window).on('hashchange', function() {
		var url = window.location.hash;
		url = url.split("#")[1];
		pages(url);
	});
	
	
	function globalHide(){
		$(".global_hide").hide()
	}
	this.globalHide = globalHide;
	
	function pages(page){
		
		if(page==undefined){
		}
		else if(page=="tpasim"){
			$(".header_title").text("מערכי הדרכה");
			tpasim.showPage();
		}
		else if(page=="comfirm"){
			comfirm.showPage();
		}
		else if(page == "login"){
			login.showPage();
		}
		else if(page == "users"){
			$(".header_title").text("הרשאות");
			users.showPage();
		}
		else if(page== "news"){
			$(".header_title").text("חדשות");
			news.showPage()
		}
	}
	this.pages = pages;
}