var menu = new menuJS()
function menuJS (){
	function create(){
		$(".menu_mini").click(markMenu)
		$(".menu_mini_tpasim").click(showTpasim);
		$(".menu_mini_users").click(showUsers);
		$(".menu_mini_comfirm").click(showComfirm);
		$(".menu_mini_news").click(showNews);
		menuHeight();
	}
	this.create = create;
	function showComfirm(){
		window.location = '/#comfirm';	
	}
	function showTpasim(){
		window.location = '/#tpasim';	
	}
	function showUsers(){
		window.location = '/#users';
	}
	function showNews(){
		window.location = '/#news';
	}
	function markMenu(){
		$(".menu_mini").removeClass("menu_miniAddClass")
		$(this).addClass("menu_miniAddClass")
	}
	function menuHeight(){
		var pageHeight = $("body").height()
		var headerHeight = $(".header").height()
		var menuHeight = pageHeight - headerHeight;
		
		$(".menu").css("height",menuHeight + "px");
	}
}
	