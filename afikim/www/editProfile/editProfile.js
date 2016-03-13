var editProfile = new editProfileJS()
function editProfileJS (){
	function showPage(){
	}
	this.showPage = showPage
	function getData(){
		$.ajax({
			type: 'GET',
			url: '/api/myUser',
			dataType: 'text',
			success: function(text) {
				if(text=="-1"){
					window.location = '/#login';	
				}
				else{
					var json = JSON.parse(text)
					showEditUser(json)
				}
			},error:function(text){
				console.log(text)
				// window.location = '/#login';	
			}
		});
	}
	this.getData = getData;
	function showEditUser(json){
		pages.globalHide()
		$(".users_add_rows_input:eq(0)").prop('disabled', true);
		$(".users_add_rows_input:eq(0)").css('border','none');
		$(".users_add_rows_input:eq(1)").prop('disabled', true);
		$(".users_add_rows_input:eq(1)").css('border','none');
		$(".users_add_rows_input:eq(2)").prop('disabled', true);
		$(".users_add_rows_input:eq(2)").css('border','none');
		$(".users_add_rows_input:eq(3)").prop('disabled', true);
		$(".users_add_rows_input:eq(3)").css('border','none');
		
		$(".users_body").hide()
		$(".users_add_submit").hide();
		$(".users").fadeIn()
		
		$(".users_add_title").html("<u>עריכת משתמש</u>")
		var id = json[0].id;
		var name = json[0].name;
		var L_name = json[0].L_name;
		var email = json[0].email;
		var adminNum = json[0].adminNum;
		var distrcit = json[0].district;
		var school = json[0].school;
		var vclass = json[0].class;
		var password = json[0].password;

		if(adminNum=="מנהל"){
			$('.users_add_rows_input1 option[value=1]').attr('selected','selected');
		}
		else if(adminNum=="צוות המשרד"){
			$('.users_add_rows_input1 option[value=2]').attr('selected','selected');
		}
		else{
			$('.users_add_rows_input1 option[value=0]').attr('selected','selected');
		}

		$(".users_add_rows_id").text(id);
		$(".users_add_rows_input").eq(0).val(name);
		$(".users_add_rows_input").eq(1).val(L_name);
		$(".users_add_rows_input").eq(2).val(distrcit);
		$(".users_add_rows_input").eq(3).val(school);
		$(".users_add_rows_input").eq(4).val(vclass);
		$(".users_add_rows_input").eq(5).val(email);
		$(".users_add_rows_input").eq(6).val(password);
		
		setTimeout(function(){
			$(".users_add_edit").fadeIn();
			$(".users_add").show()
		},300)
	}
}
setTimeout(function(){
	editProfile.showPage()
},500)
