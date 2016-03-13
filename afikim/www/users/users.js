var users = new usersJS()
function usersJS (){
	function create(){
		$(".users_deleteUsers_delete").click(deleteUsers);
		$(".users_add_submit").click(addUser);
		$(".users_add_edit").click(editUser);
		
		$(".users_header_menu:eq(0)").click(goToUsers);
		$(".users_header_menu:eq(1)").click(goToAddUser);
		$(".users_deleteUsers_header_close, .users_deleteUsers_cancel").click(closeDeleteUser);
		
		$(".users_header_menu_sort_input").change(doSort);
		$(".users_body_header_menu").click(sortTable);
	}
	this.create = create;
	function showPage(){
		$(".menu_mini_users").addClass("menu_miniAddClass")

		if($.userAdmin==1){
			pages.globalHide()
			$(".users_body").show()
			$(".users")	.show();
			
			$(".users_add_edit").hide();
			$(".users_add").hide()
			$(".users_add_rows_last").show();
			
			getData();
		}
		else if(($.userAdmin==0) || ($.userAdmin==2)){
			$(".users_add_rows_last").hide();
			editProfile.getData();
			$(".users_header_menu:eq(0)").text("עריכת משתמש");
			$(".users_header_menu:eq(1)").hide();
		}
	}
	this.showPage = showPage;
	
	function sortTable(){
		var sortName = $(this).find("span:eq(2)").text();
		var sortRoand = $(this).find("span:eq(3)").text();
		var bool;
		if (sortRoand == "true"){
			bool = true;
			$(this).find("span:last").text("false")
			$('.users_body_header_menu_span2, .users_body_header_menu_span1').css('display','none')
			$(this).find('.users_body_header_menu_span2').css('display','none')
			$(this).find('.users_body_header_menu_span1').css('display','inline-block')
		}
		else{
			bool = false;
			$(this).find("span:last").text("true")
			$('.users_body_header_menu_span2, .users_body_header_menu_span1').css('display','none')
			$(this).find('.users_body_header_menu_span1').css('display','none')
			$(this).find('.users_body_header_menu_span2').css('display','inline-block')
		}
			
		sortResults(sortName,bool)
		echoData(allData);
	}
	
	function sortResults(prop, asc) {
		allData = allData.sort(function(a, b) {
			if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
			else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
		});
		console.log(allData)
	}

	function doSort(){
		var sortNum = $(this).val()
		var loopLength = $(".users_body_rowsAll_row").length
		$(".users_body_rowsAll_row").hide();
		
		if(sortNum=="all"){
			$(".users_body_rowsAll_row").show();
			$(".users_body_rowsAll_row:first").hide();
		}
		else if(sortNum==1){
			for(var i=0; i<loopLength ;i++){
				var adminName = $(".users_body_rowsAll_row:eq(" + i + ")").find(".users_body_rowsAll_liTwo:eq(1)").text()
				if(adminName=="הרשאת על"){
					$(".users_body_rowsAll_row:eq(" + i + ")").show()
				}
			}
		}
		else if(sortNum==2){
			for(var i=0; i<loopLength ;i++){
				var adminName = $(".users_body_rowsAll_row:eq(" + i + ")").find(".users_body_rowsAll_liTwo:eq(1)").text()
				if(adminName=="צוות המשרד"){
					$(".users_body_rowsAll_row:eq(" + i + ")").show()
				}
			}
		}
		else if(sortNum==3){
			for(var i=0; i<loopLength ;i++){
				var adminName = $(".users_body_rowsAll_row:eq(" + i + ")").find(".users_body_rowsAll_liTwo:eq(1)").text()
				if(adminName=="מדריך"){
					$(".users_body_rowsAll_row:eq(" + i + ")").show()
				}
			}
		}
	}
	function goToEditUser(){
		$(".users_body").fadeOut(300)
		$(".users_add_submit").hide();
		
		$(".users_add_title").html("<u>עריכת משתמש</u>")
		var id = $(this).parent().parent().find(".users_body_rowsAll_id").text();
		var password = $(this).parent().parent().find(".users_body_rowsAll_pass").text();
		var name = $(this).parent().parent().find(".users_body_rowsAll_name").text();
		var L_name = $(this).parent().parent().find(".users_body_rowsAll_L_name").text();
		var email = $(this).parent().parent().find(".users_body_rowsAll_li").eq(1).text();
		var adminNum = $(this).parent().parent().find(".users_body_rowsAll_liTwoMiddle:eq(1)").text();
		var district = $(this).parent().parent().find(".users_body_rowsAll_district").text();
		var school = $(this).parent().parent().find(".users_body_rowsAll_school").text();
		var vclass = $(this).parent().parent().find(".users_body_rowsAll_class").text();

		if(adminNum=="הרשאת על"){
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
		$(".users_add_rows_input").eq(2).val(district);
		$(".users_add_rows_input").eq(3).val(school);
		$(".users_add_rows_input").eq(4).val(vclass);
		$(".users_add_rows_input").eq(5).val(email);
		$(".users_add_rows_input").eq(6).val(password);
		
		setTimeout(function(){
			$(".users_add_edit").show();
			$(".users_add").fadeIn(300)
		},300)
	}
	function deleteUsers(){
		var theId = $(".users_deleteUsers_id").text();
		
		$(".users_deleteUsers_deleteAddClass").addClass(".users_deleteUsers_delete")
		$(".users_deleteUsers_delete").addClass("users_deleteUsers_deleteAddClass");
		setTimeout(function(){
			$(".users_deleteUsers_delete").hide();
			$(".users_deleteUsers_loader").fadeIn();
		},300);
		
		$.ajax({
			type: 'GET',
			url: '/api/users/deleteUser/',
			data:{
				id:theId
			},
			dataType: 'text',
			success: function(text) {
				if(text=="-1"){
					window.location = '/#login';	
				}
				else{
					// setTimeout(function(){
						$(".users_deleteUsers_loader").hide();
						$(".users_deleteUsers_delete").show()
						$(".users_deleteUsers_delete").removeClass("users_deleteUsers_deleteAddClass");
						$(".users_deleteUsers").fadeOut();
						var json = JSON.parse(text)
						echoData(json);
					// },1000)
				}
			},error:function(text){
				console.log(text)
				// window.location = '/#login';	
			}
		});
	}
	function editUser(){
		var name = $(".users_add_rows_input").eq(0).val();
		var L_name = $(".users_add_rows_input").eq(1).val();
		var district = $(".users_add_rows_input").eq(2).val();
		var school = $(".users_add_rows_input").eq(3).val();
		var vclass = $(".users_add_rows_input").eq(4).val();
		var email = $(".users_add_rows_input").eq(5).val();
		var password = $(".users_add_rows_input").eq(6).val();
		var adminNum = $(".users_add_rows_input1 option:selected").val();
		var id = $(".users_add_rows_id").text();
		
		if(name.length<3){
			$(".users_add_error2").fadeIn()
		}
		else if(email.length<3){
			$(".users_add_error2").fadeIn()
		}
		else if(password.length<3){
			$(".users_add_error2").fadeIn()
		}
		else{
			editUserAjax();
		}
		setTimeout(function(){
			$(".users_add_error2").fadeOut();
		},3000)
	}
	function editUserAjax(){
		$(".users_add_loader").show();
		
		var name = $(".users_add_rows_input").eq(0).val();
		var L_name = $(".users_add_rows_input").eq(1).val();
		var district = $(".users_add_rows_input").eq(2).val();
		var school = $(".users_add_rows_input").eq(3).val();
		var vclass = $(".users_add_rows_input").eq(4).val();
		var email = $(".users_add_rows_input").eq(5).val();
		var password = $(".users_add_rows_input").eq(6).val();
		var adminNum = $(".users_add_rows_input1 option:selected").val();
		var id = $(".users_add_rows_id").text();

		$.ajax({
			type: 'GET',
			url: '/api/users/editUser/',
			data: {
				id: id,
				name: name,
				L_name: L_name,
				email: email,
				password: password,
				adminNum: adminNum,
				district: district,
				school: school,
				vclass: vclass
			},
			dataType: 'text',
			success: function(text) {
				if(text=="-1"){
					window.location = '/#login';	
				}
				else if(text=="-2"){
					setTimeout(function(){
						$(".users_add_edit").removeClass("users_add_editAddClass")
						setTimeout(function(){
							$(".users_add_edit").fadeIn(300);
							$(".users_add_loader").hide();
							$(".users_add_error1").fadeIn();
							setTimeout(function(){
								$(".users_add_error1").fadeOut();
							},3000)
						},310);
					},1000)
				}
				else{
					$(".users_add_rows_input").val("");
					setTimeout(function(){
						$(".users_add_edit").removeClass("users_add_editAddClass")
						setTimeout(function(){
							$(".users_add_edit").fadeIn(300);
							$(".users_add_loader").hide();
							$(".users_add_ok").show()
							setTimeout(function(){
								goToUsers()
							},1000)
						},310);
					},1000)
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	function closeDeleteUser(){
		$(".users_deleteUsers").fadeOut()
	}
	function goToUsers(){
		if($.userAdmin == 1){
			getData();
			$(".users_body, .users_add").fadeOut()
			$(".users_header_menu").removeClass("users_header_menuClick")
			$(".users_header_menu:eq(0)").addClass("users_header_menuClick")
			setTimeout(function(){
				$(".users_body").fadeIn();
			},300)
		}
	}
	function goToAddUser(){
		$(".users_add_edit").hide();
		$(".users_add_submit").show();
		
		$(".users_add_rows_input").val("");
		
		$(".users_body").fadeOut()
		$(".users_header_menu").removeClass("users_header_menuClick")
		$(".users_header_menu:eq(1)").addClass("users_header_menuClick")
		setTimeout(function(){
			$(".users_add_title").html("<u>הוספת משתמש</u>")		
			$(".users_add").fadeIn();
		},300)
	}
	function getData(){
		$.ajax({
			type: 'GET',
			url: '/api/users/showusers',
			dataType: 'text',
			success: function(text) {
				if(text=="-1"){
					window.location = '/#login';	
				}
				else{
					var json = JSON.parse(text)
					echoData(json);
				}
			},error:function(text){
				window.location = '/#login';	
			}
		});
	}
	var allData;
	function echoData(data){
		allData = data;
		var loopLength = data.length;
		
		var clone = $('.users_body_rowsAll_row:first').clone();
		$(".users_body_rowsAll_row").remove();
		$('.users_body_rowsAll').append(clone);
		
		for(var i=0; i<loopLength ;i++){
			var clone = $('.users_body_rowsAll_row:first').clone();
			if(data[i].L_name==null){
				clone.find(".users_body_rowsAll_li:eq(0)").text(data[i].name);
			}
			else{
				clone.find(".users_body_rowsAll_li:eq(0)").text(data[i].name + " " + data[i].L_name);
			}
			clone.find(".users_body_rowsAll_name").text(data[i].name);
			clone.find(".users_body_rowsAll_L_name").text(data[i].L_name);
			clone.find(".users_body_rowsAll_li:eq(1)").text(data[i].email);
			clone.find(".users_body_rowsAll_id").text(data[i].id);
			clone.find(".users_body_rowsAll_pass").text(data[i].password);
			clone.find(".users_body_rowsAll_district").text(data[i].district)
			clone.find(".users_body_rowsAll_school").text(data[i].school)
			clone.find(".users_body_rowsAll_class").text(data[i].class)
			
			if(data[i].admin==1){
				clone.find(".users_body_rowsAll_liTwo:eq(1)").text("הרשאת על");
			}
			else if(data[i].admin==2){
				clone.find(".users_body_rowsAll_liTwo:eq(1)").text("צוות המשרד");
			}
			else{
				clone.find(".users_body_rowsAll_liTwo:eq(1)").text("מדריך");
			}
			
			if(data[i].firstTime==1){
				clone.find(".users_body_rowsAll_liTwo:eq(0)").text("פעיל");
			}
			else{
				clone.find(".users_body_rowsAll_liTwo:eq(0)").text("לא פעיל");
			}
			
			clone.find(".users_body_rowsAll_li_delete").click(showDeleteUser);
			clone.find(".users_body_rowsAll_li_edit").click(goToEditUser);
			
			clone.show();
			$('.users_body_rowsAll').append(clone);
		}
	}
	
	function showDeleteUser(){
		var userName = $(this).parent().parent().find(".users_body_rowsAll_li:eq(0)").text();
		var id = $(this).parent().parent().find(".users_body_rowsAll_id").text();
		
		$(".users_deleteUsers").fadeIn();
		
		$(".users_deleteUsers_id").text(id);
		$(".users_deleteUsers_text span").text(userName);
	}
	function addUser(){
		var name = $(".users_add_rows_input").eq(0).val();
		var L_name = $(".users_add_rows_input").eq(1).val();
		var district = $(".users_add_rows_input").eq(2).val();
		var school = $(".users_add_rows_input").eq(3).val();
		var vclass = $(".users_add_rows_input").eq(4).val();
		var email = $(".users_add_rows_input").eq(5).val();
		var password = $(".users_add_rows_input").eq(6).val();
		var admin = $(".users_add_rows_input1 option:selected").val();
		
		if(name.length<3){
			$(".users_add_error2").fadeIn()
		}
		else if(email.length<3){
			$(".users_add_error2").fadeIn()
		}
		else if(password.length<3){
			$(".users_add_error2").fadeIn()
		}
		else{
			addUserAjax();
		}
		setTimeout(function(){
			$(".users_add_error2").fadeOut();
		},3000)
	}
	function addUserAjax(){
		$(".users_add_loader").show();
		
		var name = $(".users_add_rows_input").eq(0).val();
		var L_name = $(".users_add_rows_input").eq(1).val();
		var district = $(".users_add_rows_input").eq(2).val();
		var school = $(".users_add_rows_input").eq(3).val();
		var vclass = $(".users_add_rows_input").eq(4).val();
		var email = $(".users_add_rows_input").eq(5).val();
		var password = $(".users_add_rows_input").eq(6).val();
		var admin = $(".users_add_rows_input1 option:selected").val();
		
		$.ajax({
			type: 'GET',
			url: '/api/users/createUser/',
			data:{
				name: name,
				L_name: L_name,
				email: email,
				password: password,
				adminNum: admin,
				district: district,
				school: school,
				vclass: vclass
			},
			dataType: 'text',
			success: function(text) {
				if(text=="-1"){
					window.location = '/#login';	
				}
				else if(text=="-2"){
					setTimeout(function(){
						$(".users_add_submit").removeClass("users_add_submitAddClass")
						setTimeout(function(){
							$(".users_add_submit").fadeIn(300);
							$(".users_add_loader").hide();
							$(".users_add_error1").fadeIn();
							setTimeout(function(){
								
								$(".users_add_error1").fadeOut();
							},3000)
						},310);
					},1000)
					
				}
				else{
					$(".users_add_rows_input").val("");
					setTimeout(function(){
						$(".users_add_submit").removeClass("users_add_submitAddClass")
						setTimeout(function(){
							$(".users_add_submit").fadeIn(300);
							$(".users_add_loader").hide();
							$(".users_add_ok").show()
						},310);
						setTimeout(function(){
							$(".users_add_ok").fadeOut();
						},3000)
					},1000)
				}
			},error:function(json){
				window.location = '/#login';	
			}
		});
	}
}
	