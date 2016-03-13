$(function(){
	load();
	function load(){
		load_header();
		load_menu();
		
		load_tpasim();
		load_page1();
		load_login();
		load_comfirm();
		load_news();
				
		load_userAjax()
	}
	function load_userAjax(){
		$.ajax({
			type: 'GET',
			url: '/api/checkUser/',
			dataType: 'text',
			success: function(text) {
				json = JSON.parse(text);
				if(text=="-1"){
					window.location = '/#login';	
				}
				else{
					$.user = json[0];
					$.userAdmin = $.user['admin'];
					
					$(".header_user").text($.user.name + " " + $.user.L_name)
					
					if($.userAdmin==0){
						$(".header_admin").text("מדריך")
					}
					else if($.userAdmin==1){
						$(".header_admin").text("הרשאת על")
					}
					else if($.userAdmin==2){
						$(".header_admin").text("צוות המשרד")
					}
					
					if($.userAdmin != 1){
						$(".menu_mini_comfirm, .menu_mini_news").hide();
						$(".menu_miniAddClass").text("עריכת פרופיל");
					}
					
					tpasim.admin();
				}
			},error:function(json){
				window.location = '/#login';	
			}
		});
	}
	function load_header(){
		$(".header").load( "www/header/header.html", function() {
			header.create();
		});	
	}
	function load_tpasim(){
		var url = window.location.hash.split("#")[1];
		$(".tpasim").load( "www/tpasim/tpasim.html", function() {
			$(".tpasim_body_temps").load( "www/tpasim/tpasim_body_temps/tpasim_body_temps.html", function() {
				tpasimBodyTemps.create();
				var url = window.location.hash;
				var url = url.split("#")[1];
				pages.pages(url);
				$(".tpasim_body_temps_maharah").load( "www/tpasim/tpasim_body_temps_maharah/tpasim_body_temps_maharah.html", function() {
					maharah.create();
					tpasim.create();
					if(url=="tpasim" || url==undefined){
						tpasim.showPage();
					}
				});	
			});	
		});	
	}
	function load_news(){
		$(".news").load( "www/news/news.html", function() {
			news.ctor();
		});	
	}
	function load_page1(){
		$(".users").load( "www/users/users.html", function() {
			var url = window.location.hash.split("#")[1];
			users.create();
			if(url=="users"){
				users.showPage();
			}
		});	
	}
	function load_comfirm(){
		$(".comfirm").load( "www/comfirm/comfirm.html", function() {
			$(".comfirm_box").load( "www/comfirm/comfirm_box/comfirm_box.html", function() {
				comfirm.create()
			});	
		});	
	}
	function load_menu(){
		$(".menu").load( "www/menu/menu.html", function() {
			menu.create();
		});	
	}
	function load_login(){
		$(".login").load( "www/login/login.html", function() {
			login.create();
		});	
	}
})