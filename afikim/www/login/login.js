var login = new loginJS()
function loginJS (){
	function create(){
		// document.cookie = 'session=mor;';
		$(".login_body_submit").click(doLogin);
	}
	this.create = create;
	function showPage(){
		$(".login").show();
	}
	this.showPage = showPage;
	
	function doLogin(){
		$(".login_body_submit").addClass("login_body_submitAddClass");
		// $(".login_body_submit").fadeOut(300)
		setTimeout(function(){
			$(".login_body_loader").show();
		},300)
		
		var email = $(".login_body_input").eq(0).val();
		var password = $(".login_body_input").eq(1).val();
		
		$.ajax({
			type: 'GET',
			url: '/api/login/',
			data:{
		        email : email,
		        password : password
			},
			dataType: 'text',
			success: function(data) {
				setTimeout(function(){
					afterLogin(data)
				},1000)
			}
		});
	}
	function afterLogin(data){
		header.getData();
		if(data.length>5){
			document.cookie="session = " + data;
			
			$(".login_body_submit").removeClass("login_body_submitAddClass");
			$(".login_body_loader").fadeOut(300)
			setTimeout(function(){
				$(".login_body_submit").show();
			},300)
			
			$(".login").fadeOut();
			window.location = "/#tpasim";
		}
		else{
			$(".login_body_submit").removeClass("login_body_submitAddClass");
			$(".login_body_loader").fadeOut(300)
			setTimeout(function(){
				$(".login_body_submit").show();
				$(".login_body_errorMessage").fadeIn(600);
				// $(".login_body").animate({ height: 360 }, 600);
				setTimeout(hideError,3000);
			},300)
		}
		
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
						$(".menu_mini_users").text("עריכת פרופיל");
					}
					
					setTimeout(function(){
						if($.user['firstTime']==0){
							$(".comfirm_box_block, .comfirm_box_all").show()
						}
					},100)
					tpasim.admin();
				}
			},error:function(json){
				window.location = '/#login';	
			}
		});
	}
	function hideError(){
		$(".login_body_errorMessage").fadeOut(600);
		// $(".login_body").animate({ height: 310 }, 600);
	}
}
	