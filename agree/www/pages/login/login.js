var login = new loginJs();
function loginJs(){
	function ctor(){
		$(".login_submit").click(doLoginValidation);
		$(".login_close").click(hidePage)
	}
	this.ctor = ctor;
	
	function showPage(){
		$(".global_page_login").show();
	}
	this.showPage = showPage;
	
	function hidePage(){
		$(".global_page_login").hide();
	}
	
	function doLoginValidation(){
		$(".input_error").hide();
		var email = $(".login_input_email").val();
		var password = $(".login_input_password").val();

		if(email.length<3 || password.length<3){
			$(".input_error1").show()
		}
		else{
			doLogin(email,password);
		}
	}
	function doLogin(email,password){
		var data = {};
		
		data = {
			email: email,
			password:password
		}
		var url = '/api/users/login/';
		
		global.api(url,data,function(data){
			if(data=="error: password or email not currect"){
				$(".input_error2").show();
			}
			else{
				// location.href= '/#allDispute';
				$.cookie("session", data);
				setTimeout(function(){
					location.href='/';
					//global.getUser();
				},500)
			}
		})
	}
}
