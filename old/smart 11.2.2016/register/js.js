$(window).load(function(){	
	var english = /^[A-Za-z0-9]*$/;
	var campionVersion = "2.0";
	load()
	function load(){
		$(".lp_registerBtn").click(openPopup)
        $('.lp_box1_btn').click(btn1Submit);
		$('.lp_box2_btn').click(btn2Submit);
		$('.lp_box3_btn').click(btn3Submit);
		$('.lp_submitNewMail').click(changeMail)
		
		$(".lp_input_userName").keypress(inputKeyPress1);
		$(".lp_input_email").keypress(inputKeyPress2);
		$(".lp_input_pass1, .lp_input_pass2").keypress(inputKeyPress3);
		$(".lp_input_changeEmail").keypress(inputKeyPress4);

		$(".lg_box4_mailNotGetHolder").click(openCloseChangeEmail);
		$(".lp_box4_btn").click(comfirmRegister);
		
		checkUrl()
		// openPopup()
		// show4Stage()
		
		sendMix("start");
	}
	
	var pastEmail;
	function changeMail(){
		var userName = $('.lp_input_userName').val();
		var email = $('.lp_input_changeEmail').val();
		var password = $('.lp_input_pass1').val();
		
		$(".lp_box3_btn").addClass("lp_box1_btnAddClass");
		$(".lp_box3_btn").find(".loading").show();
		
		var url = '/api/users/changeMail/'
		var data = {
			pastEmail:pastEmail,
			email:email,
			userName:userName,
			password:password
		}
		
		if (!validateEmail(email)) {
			showAlert('כתובת דוא"ל לא תקינה')
		}
		else{
			api(url,data,function(data){
				pastEmail = email;
				if(data=='sucsses'){
					openCloseChangeEmail()
					$(".lg_box4_mail_success").fadeIn();
					setTimeout(function(){
						$(".lg_box4_mail_success").fadeOut();
					},3000)
				}
				else {
					showAlert(data);
				}
				div.removeClass('lp_box1_btnAddClass')
				div.find(".loading").hide()
			})
		}
	}
	
	function checkUrl(){
		var url = location.href.toString()
		url = url.split("#")[1]
		if(url != undefined){
			var comfirmPass = url.split('=')[1];
			comfirmUser(comfirmPass)
		}
	}
	
	function getCampion(){
		var url = location.href.toString()
		url = url.split("?")[1]
		if(url!=undefined){
			var campion = parseInt(url.split('campion=')[1]);
			return("campion: " + campion + " version: " + campionVersion)
		}
		else{
			return(0)
		}
	}
	
	function comfirmRegister(){
		var comfirmPass = $(".lp_input_emailCheck").val()
		
		if(comfirmPass.length>3){
            fbq('track', 'CompleteRegistration');
			comfirmUser(comfirmPass)
		}
		else{
			showAlert('הסיסמה שהזנת אינה נכונה')
		}
	}
	function comfirmUser(comfirmPass){
		var url = '/api/users/comfirmRegister/'
		var data = {
			pass:comfirmPass
		}
		api(url,data,function(data){
			if(data != "error: worng password"){
				sendMix("finish");
				setTimeout(function(){
					$.cookie("session", data, { path: '/' });
	
					location.href = '/';
				},1000)
			}
			else{
				showAlert('הסיסמה שהזנתך לא נכונה')
			}
		})	
	}
	
	function inputKeyPress1(e){
		if(e.which == 13) {
			btn1Submit()
		}
	}
	function inputKeyPress2(e){
		if(e.which == 13) {
			btn2Submit()
		}
	}

	function inputKeyPress3(e){
		if(e.which == 13) {
			btn3Submit()
		}
	}
	function inputKeyPress4(e){
		if(e.which == 13) {
			changeMail()
		}
	}
	function openPopup(){
		sendMix("open popup");
		$(this).hide();
		$('.lp_background').css('-webkit-filter', 'blur(20px)')
		$(".lp_popup").fadeIn()
	}
	
	function btn1Submit() {
		sendMix("next1 start");
		
		hideAlert();
		
		var userName = $('.lp_box1 input').val();
		var url = '/api/users/registerCheck/'
		var data = {
			textCheck:userName,
			check:1
		}
		
		var div = $('.lp_box1_btn');
		
		if(english.test(userName)==false){
			showAlert('שם המשתמש חייב להיות באנגלית ועם אותיות רגילות')
		}
		else if (userName.length < 3) {
			showAlert('שם משתמש קצר מ3 תווים')
		}
		else{
			div.addClass('lp_box1_btnAddClass')
			div.find(".loading").show()
			
			setTimeout(function(){
				api(url,data,function(data){
					var json = JSON.parse(data);
					
					if(json[0].userNameCounter>0){
						showAlert('שם המשתמש תפוס, אנא בחר שם אחר')
					}
					else {
						hideAlert();
						show2Stage();
					}
					div.removeClass('lp_box1_btnAddClass')
					div.find(".loading").hide()
				})
			},1000)
		}
	}
	
	function btn2Submit() {
		sendMix("next2 start");
		
		hideAlert();
		
		var email = $('.lp_box2 input').eq(0).val();
		var url = '/api/users/registerCheck/'
		var data = {
			textCheck:email,
			check:2
		}
		
		$(".lg_box4_mail_text").text(email)
		var div = $(".lp_box2_btn");
		div.addClass('lp_box1_btnAddClass')
		div.find(".loading").show()
		
		setTimeout(function(){
			api(url,data,function(data){
				var json = JSON.parse(data);

				if(json[0].emailCounter>0){
					showAlert('האימייל כבר קיים במערכת')
				}
				else if (email.length < 3) {
					showAlert('כתובת דוא"ל קצרה מ3 תווים')
				}
				else if (!validateEmail(email)) {
					showAlert('כתובת דוא"ל לא תקינה')
				}
				else {
					hideAlert();
					show3Stage();
				}
				div.removeClass('lp_box1_btnAddClass')
				div.find(".loading").hide()
			})
		},1000)
	}
	
	function btn3Submit(){
		sendMix("next3 start");
		
		var password1 = $('.lp_input_pass1').val();
		var password2 = $('.lp_input_pass2').val();
		
		if (password1.length < 4) {
			showAlert('סיסמא קצרה מ4 תווים')
		}
		else if (password1 != password2) {
			showAlert('הסיסמאות לא תואמות')
		}
		else {
			register()
		}
	}
	
	function register(){
		var userName = $('.lp_input_userName').val();
		var email = $('.lp_input_email').val();
		var password = $('.lp_input_pass1').val();
		var campion = getCampion();
		pastEmail = email;
		
		var div = $(this);
		
		$(".lp_box3_btn").addClass("lp_box1_btnAddClass");
		$(".lp_box3_btn").find(".loading").show();

		var url = '/api/users/register/'
		var data = {
			email:email,
			userName:userName,
			password:password,
			campion:campion
		}
		
		api(url,data,function(data){
			// var json = JSON.parse(data);
			
			if(data=='sucsses'){
				show4Stage()
			}
			else if(data=='error: can register just 6 times a day'){
				showAlert('ניתן להרשם עד 6 פעמים ביום')
			}
			else {
				showAlert(data);
			}
			div.removeClass('lp_box1_btnAddClass')
			$(".loading").hide()
		})
	}
	
	function show2Stage() {
		sendMix("next1 finish");
		
		globalHide();

		setTimeout(function(){
			$('.lp_box2').fadeIn(310);
			$(".lp_input_email").focus()
		},300)
		$(".lp_popup_flow_stage2").addClass("active");
	}
	
	function show3Stage() {
		sendMix("next2 finish");
		
		globalHide();
		$(".lp_input_pass1").focus()

		setTimeout(function(){
			$('.lp_box3').fadeIn(310);
		},300)
		$(".lp_popup_flow_stage3").addClass("active");
	}
	
	function show4Stage(){
		sendMix("next3 finish")
		
		globalHide();
		$(".lp_popup_flow, .lp_popup_title").fadeOut()

		setTimeout(function(){
			$('.lp_box4').fadeIn(310);
		},300)
		$(".lp_popup_flow_stage3").addClass("active");
	}
	
	function showAlert(text) {
		$('.lp_alert').fadeIn();
		$('.lp_alert').text(text);
	}
	
	function globalHide() {
		$('.lp_box1').fadeOut(300);
		$('.lp_box2').fadeOut(300);
		$('.lp_box3').fadeOut(300);
		$( ".lp_popup_flow_stage1" ).removeClass( "active" )
		$( ".lp_popup_flow_stage2" ).removeClass( "active" )
		$( ".lp_popup_flow_stage1" ).removeClass( "active" )
	}
	function hideAlert() {
		$('.lp_alert').fadeOut();
	}

	 function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
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
	
	var ChangeEmailOpen = 0;
	function openCloseChangeEmail(){
		if(ChangeEmailOpen == 0){
			ChangeEmailOpen=1;
			$(".lg_box4_mailNotGet span").css("transform", "rotate(180deg)")
			$(".lg_box4_mailNotGet").addClass("lg_box4_mailNotGetAddClass");
			
			$(".lg_box4_mail_success").hide()
			$(".lg_box4_mail").show()
		}
		else{
			ChangeEmailOpen=0;
			$(".lg_box4_mailNotGet span").css("transform", "rotate(0deg)")
			$(".lg_box4_mailNotGet").removeClass("lg_box4_mailNotGetAddClass");
			
			$(".lg_box4_mail").hide()
		}
	}
	
	function sendMix(text){
		var campion = getCampion();
		if(campion != 0 && campion!="0"){
			mixpanel.track(campionVersion + " : " + text);
		}
	}
})