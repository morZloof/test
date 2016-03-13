$(window).load(function(){
	load()

	function load(){
		$(".lp_box1_btn").click(sendDetails);
	}
	
	function showAlert(text) {
		$(".loading").hide();
		$('.lp_alert').fadeIn();
		$('.lp_alert').text(text);
	}
	
	function sendDetails() {
		$('.lp_alert').fadeOut();
		var email = $('.lp_input_userName').val();
		
		if (!validateEmail(email)) {
			showAlert('כתובת דוא"ל לא תקינה')
		}
		else {
			sendDetailsToAPI();
		}		
	}
	
	function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
	}
	
	function sendDetailsToAPI() {
		$(".loading").show()
		var email = $('.lp_input_userName').val();
		var password = $('.lp_input_password').val();
		
		var url = '/api/users/login/'
		var data = {
			email:email,
			password:password
		}
		api(url,data,function(data){
			if(data != "badUserNameAndPass"){
				setTimeout(function(){
					$.cookie("session", data, { path: '/' });
					location.href = '/';
				},1000)
				console.log(data)
			}
			else{
				showAlert('שם המשתמש או סיסמא לא נכונים')
			}
		})	
		
	}
		
	function api(url,data,callback){
		// url = "http://127.0.0.1:3000" + url;

		$.ajax({
			type: 'GET',
			url: url,
			data: data,
			dataType: 'text',
			success: function(data) {
				var checkMinus10 = (data[0] + data[1] + data[2]);

				if(checkMinus10 == "-10"){
					alert("שגיאה לא ידועה : " + data)
				}
				else{
					callback(data)
				}
			},error:function(){
			}
		});
	}
	
	
	
})