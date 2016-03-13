var login = new loginJs();
function loginJs(){
	function ctor(){
		$(".login_submit").click(doLogin);
		$('.login_registerBtn').click(showRegister)
		$('.register_submit').click(doRegister);
		$(".login_input").keypress(inputKeyPress);

	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide();
		$(".global_pagesFixed").hide();
		$(".global_page_login").show();
	}
	this.showPage = showPage;

	function inputKeyPress(e){
		if(e.which == 13) {
			doLogin()
		}
	}

	function doLogin(){
		$(".login_error").hide();
		var vemail = $(".login_input").eq(0).val();
		var vpassword = $(".login_input").eq(1).val();
		var data = {
			email: vemail,
			password: vpassword
		}

		var url = '/api/users/login/';
		global.api(url,data,function(data){
			if(data=="badUserNameAndPass"){
				$(".login_error").show();
			}
			else{
				$.cookie("session", data);
				location.href = '/';
				//successLoginAndRegister(data)
			}
		})
	}
	function successLoginAndRegister(data){
		$.cookie("session", data);
		
		global.showDasInFirstTime=1;
		global.showDashboard();
		global.getUser();
	}
	function showRegister() {
		$('.login_register').fadeIn();
		$('.login_holder').hide();
	}
	 
	function doRegister(){
		var allGood = 1; 
		$(".register_error").hide();
		//GET THE DEATILS
		var reg_userName = $(".register_input_userName").val();
		var reg_mail = $(".register_input_mail").val();
		var reg_password = $(".register_input_password").val();
		var reg_passwordRepeat = $(".register_input_passwordRepeat").val();
		
		// VALIDATION 
		
		if( !validateEmail(reg_mail)) { 
			alert("email not good")
			allGood = 0;
		 }
		 
		if( reg_userName.length < 3) { 
			alert("שם משתמש חייב להיות מעל 3 תווים")
			allGood = 0;
		 }
		 
		if( (reg_mail.length < 4)) { 
			alert("אימייל חייב להיות מעל 4 תווים")
			allGood = 0;
		 }
		if( (reg_password.length < 3) ) {
			alert("סיסמא חייבת להיות מעל 3 תווים")
			allGood = 0;
		 }
		 else if( (reg_password != reg_passwordRepeat) ) {	
			alert("סיסמאות לא תואמות")
			allGood = 0;
		 }
		 if (allGood == 1) {
			 sendRegDeatilsToApi(reg_userName,reg_mail,reg_password)
		 }
	}
	function sendRegDeatilsToApi(userName,email,password) {		
		var data = {
			userName: userName,
			email: email,
			password: password
		}
			
		var url = '/api/users/register/';
		global.api(url,data,function(data){
			if(data=="user exist"){
				alert("User Exist!")
			}
			else{
				successLoginAndRegister(data)
			}
		})
	}
	function validateEmail($email) {
  		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  		return emailReg.test( $email );
	}
}
