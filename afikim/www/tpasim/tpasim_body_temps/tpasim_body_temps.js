var tpasimBodyTemps = new tpasimBodyTempsJS();
function tpasimBodyTempsJS(){
	var tempNameGlobal = "aaa123";
	function create(){
		$(".tpasim_body_temps_back").click(goBack);
		$(".tpasim_body_temps_alert_header_close, .tpasim_body_temps_alert_submitRow_submit2, .tpasim_body_temps_folderAll_delete_header_close").click(closePopUp);
		$(".tpasim_body_temps_deleteButtonAll").click(showPopUp);
		$(".tpasim_body_temps_alert_submitRow_submit1").click(deleteTemp);
		$(".tpasim_body_temps_alert_submitRow_submit3").click(deleteFile);
		$(".tpasim_body_temps_changeName_submit").click(changeFolderName);
		$(".tpasim_body_temps_changeTempNameAll").click(openChangeTempPopUp);
		$(".tpasim_body_temps_changeName_close").click(closeChangePopUp);
		
		$(".tpasim_body_temps_menuHeader_menu1").click(sortLine);
	}
	this.create = create;
	
	function showPage(){
		getData();
		getFiles(0);
		pages.globalHide();
		$(".tpasim_body_temps_menuHeader_menu_span1").css("display","none")
		$(".tpasim_body_temps_menuHeader_menu_span2").css("display","none")
		$(".tpasim_body_temps_maharah, .tpasim_body_temps_back, .tpasim_body_temps_boardscrap").hide();
		$(".tpasim_body_temps_menuHeaderHide").show();
		$(".tpasim").show();
		$(".tpasim_body_temps_menuHeaderHide").hide()
	}
	this.showPage = showPage;
	
	function sortLine(){
		var sortBy = $(this).find("span:eq(2)").text();
		var sortZad = $(this).find("span:eq(3)").text();
		var bool;
		if(sortZad=="true"){
			$(this).find("span:last").text("false");
			bool = true;
			$(".tpasim_body_temps_menuHeader_menu_span2").css("display","none");
			$(".tpasim_body_temps_menuHeader_menu_span1").css("display","inline-block");
		}
		else{
			$(this).find("span:last").text("true");
			bool = false;
			$(".tpasim_body_temps_menuHeader_menu_span1").css("display","none");
			$(".tpasim_body_temps_menuHeader_menu_span2").css("display","inline-block");
		}
		sort(sortBy,bool);
	}
	function sort(prop, asc) {
		fileJson = fileJson.sort(function(a, b) {
			if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
			else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
		});
		echoFiles(fileJson);
	}
	function closeChangePopUp(){
		$(".tpasim_body_temps_changeName_block, .tpasim_body_temps_changeName").fadeOut()
	}
	function openChangeTempPopUp(){
		$(".tpasim_body_temps_changeName_block, .tpasim_body_temps_changeName").fadeIn()
	}
	function changeFolderName(){
		var folderName = $(".tpasim_body_temps_changeName_inputRow_input").val().length;
		
		$(".tpasim_body_temps_changeName_error").hide()
		if(folderName<4){
			$(".tpasim_body_temps_changeName_error").fadeIn()
		}
		else{
			changeFolerNameAjax()
		}
	}
	function changeFolerNameAjax(){
		var folderName = $(".tpasim_body_temps_changeName_inputRow_input").val();
		var id = $(".tpasim_body_temps_changeName_id").text();
		$(".tpasim_body_temps_changeName_loader").show()
		
		$.ajax({
			type: 'GET',
			url: '/api/changeTempName/',
			data:{
				id: id,
				newName: folderName
			},
			dataType: 'text',
			success: function(json) {
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
		
		setTimeout(function(){
			$(".tpasim_body_temps_changeName_loader").hide()
			$(".tpasim_body_temps_changeName_block, .tpasim_body_temps_changeName").fadeOut()
		},1000)
		
	}
	function goToFirstMenu(){
		showPage()
	}
	function getFiles(id){
		$.ajax({
			type: 'GET',
			url: '/api/nameOfFiles/',
			data:{
				tempId: id
			},
			dataType: 'text',
			success: function(json) {
				json = JSON.parse(json)
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					echoFiles(json);
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	var fileJson;
	function echoFiles(json){
		fileJson=json;
		var loopLength = json.length;
		
		var clone = $(".tpasim_body_temps_rowAll_row:first").clone();
		$(".tpasim_body_temps_rowAll_row").remove();
		$(".tpasim_body_temps_rowAll").append(clone);

		for(var i=0; i<loopLength ;i++){
			var clone = $(".tpasim_body_temps_rowAll_row:first").clone();
			clone.find(".tpasim_body_temps_menuHeader_menu1 span").text(json[i].name);
			clone.find(".tpasim_body_temps_menuHeader_menu2").html(json[i].text);
			clone.find(".tpasim_body_temps_rowAll_id").text(json[i].id);
			clone.find(".tpasim_body_temps_rowAll_row_delete").click(openDeleteFile);
			
			if($.userAdmin == 1){
				$(".tpasim_body_temps_rowAll_row_edit").text("עריכה")
			}
			else{
				$(".tpasim_body_temps_rowAll_row_edit").text("צפייה")
			}
			
			if($.userAdmin==0){
				clone.find(".tpasim_body_temps_rowAll_row_delete").hide();
			}
			clone.find(".tpasim_body_temps_rowAll_row_edit").click(maharah.showMaharah);
			clone.show()
			
			$(".tpasim_body_temps_rowAll").append(clone);
			
			
		}
		// $(".tpasim_body_temps_rowAll_row_edit:eq(1)").click()
		setTimeout(function(){
			setHeight()
		},3000)
	}
	function setHeight(){

		var loopLength = $(".tpasim_body_temps_rowAll_row").length
		
		for(var i=1; i<loopLength ;i++){ 
			var height = $(".tpasim_body_temps_rowAll_row:eq(" + (i) + ")").find('.tpasim_body_temps_menuHeader_menu2').height()
			console.log(height)
			if(height<40){
				height=40;
			}
			$(".tpasim_body_temps_rowAll_row:eq(" + (i) + ")").find(".tpasim_body_temps_rowAll_row_li").css("height",height + "px")
		}
	}
	function getData(){
		$.ajax({
			type: 'GET',
			url: '/api/nameOfTemps',
			dataType: 'text',
			success: function(json) {
				json = JSON.parse(json)
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					echoFolders(json);
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	this.getData = getData;
	function echoFolders(json){
		var loopLength = json.length;
		
		var clone = $(".tpasim_body_temps_folder:first").clone();
		$('.tpasim_body_temps_folder').remove();
		$('.tpasim_body_temps_folderAll').append(clone);
		
		var clone2 = $(".tpasim_body_addTemp_row_select option:first").clone();
		$(".tpasim_body_addTemp_row_select option").remove();
		$(".tpasim_body_addTemp_row_select").append(clone2);
		
		var clone3 = $(".tpasim_body_addTopes_row_select option:first").clone();
		$(".tpasim_body_addTopes_row_select option").remove();
		$(".tpasim_body_addTopes_row_select").append(clone3);
		
		
		for(var i=0; i<loopLength ;i++)
		{
			var clone = $(".tpasim_body_temps_folder:first").clone();
			clone.find('.tpasim_body_temp_folder_title').text(json[i].temp);
			clone.find('.tpasim_body_temp_folder_tempId').text(json[i].id)

			clone.click(enterTemp1);
			$('.tpasim_body_temps_folderAll').append(clone);
			$(".tpasim_body_addTemp_row_select").append("<option>" + json[i].temp + "</option>");
			$(".tpasim_body_addTopes_row_select").append("<option value='" + json[i].id + "'>" + json[i].temp + "</option>");
			clone.show();
		}
	}
	this.echoFolders = echoFolders;
	function openDeleteFile(){
		var id = $(this).parent().parent().find(".tpasim_body_temps_rowAll_id").text()
		var file = $(this).parent().parent().find(".tpasim_body_temps_menuHeader_menu1").text();
		$(".tpasim_body_temps_folderAll_delete_header_text span").text(file);
		$(".tpasim_body_temps_folderAll_delete_id").text(id);
		$(".tpasim_body_temps_folderAll_deleteBlock, .tpasim_body_temps_folderAll_delete").fadeIn()
	}
	function showBoardscrap(tempName){
		$(".tpasim_body_temps_boardscrap").show();
		if($(".tpasim_body_temps_boardscrap_menu:eq(0)").is(":visible")==false){
			$(".tpasim_body_temps_boardscrap_menu:eq(0)").show();
			$(".tpasim_body_temps_boardscrap_menu:eq(0)").find(".tpasim_body_temps_boardscrap_menu_text").text(tempName)
		}
		else{
			$(".tpasim_body_temps_boardscrap_menu:eq(1)").show();
			$(".tpasim_body_temps_boardscrap_menu:eq(1)").find(".tpasim_body_temps_boardscrap_menu_text").text(tempName)
		}
	}
	function enterTemp1(){
		
		var tempName = $(this).find(".tpasim_body_temp_folder_title").text()
		var tempId = $(this).find(".tpasim_body_temp_folder_tempId").text()
		$(".tpasim_body_temps_changeName_id").text(tempId);
		$(".tpasim_body_temps_changeName_text span").text(tempName);
		
		tempId = (tempId);
		
		getFiles(tempId);
		tempNameGlobal = tempName;
		
		var div = $(this);
		$(this).find(".tpasim_body_temps_folder_icon").css("background","none");
		$(this).find(".tpasim_body_temp_folder_loading").show();
		setTimeout(function(){
			$.ajax({
				type: 'GET',
				url: '/api/nameOfTemps1/',
				data:{
					temp: tempName
				},
				dataType: 'text',
				success: function(json) {
					json = JSON.parse(json)
					if(json=="-1"){
						window.location = '/#login';	
					}
					else{
						$(".tpasim_body_temps_menuHeaderHide").show()
						showBoardscrap(tempName)
						$(".tpasim_body_temps_addButtonAll").hide();
						$(".tpasim_body_temps_deleteButtonAll, .tpasim_body_temps_changeTempNameAll").show();
						$(".tpasim_body_temps_back").fadeIn();
						echoFolders(json);
						
						if($.userAdmin != 1){
							$(".tpasim_body_temps_changeTempNameAll, .tpasim_body_temps_deleteButtonAll").hide()
						}
					}
				},error:function(json){
				}
			});
		},1000)
	}
	function deleteTemp(){
		$(".tpasim_body_temps_alert_submitRow_submit1").addClass('tpasim_body_temps_alert_submitRow_submitAddClass');
		var theTemp = $(this).parent().parent().find(".tpasim_body_temps_alert_text span").text();
		
		setTimeout(function(){
			$(".tpasim_body_temps_alert_submitRow_submit").hide();
			$(".tpasim_body_temps_alert_submitRow_loader").show();
		},300)
		setTimeout(function(){
			$.ajax({
				type: 'GET',
				url: '/api/deleteTemp/',
				data:{
					temp: tempNameGlobal
				},
				dataType: 'text',
				success: function(json) {
					if(json=="-1"){
						window.location = '/#login';	
					}
					$(".tpasim_body_temps_deleteButtonAll, .tpasim_body_temps_changeTempNameAll").hide();
				},error: function(){
				}
			});
			
			closePopUp();
			showPage();
			$(".tpasim_body_temps_alert_submitRow_submit").removeClass('tpasim_body_temps_alert_submitRow_submitAddClass');
			$(".tpasim_body_temps_alert_submitRow_loader").hide();
			$(".tpasim_body_temps_alert_submitRow_submit").show();
		},1000)
		
	}
	function goBack(){
		$(".tpasim_body_temps_boardscrap_menu, .tpasim_body_temps_deleteButtonAll, .tpasim_body_temps_changeTempNameAll").hide()
		$(".tpasim_body_temps_back, .tpasim_body_temps_boardscrap").hide();
		getData()
	}
	function showPopUp(){
		var fileLength = $(".tpasim_body_temps_rowAll_row").length;
		var folderLnegth  = $('.tpasim_body_temps_folder').length

		if(fileLength+folderLnegth < 3){
			$(".tpasim_body_temps_alertMessage").show()
			$(".tpasim_body_temps_alertCnatDelete").hide()
		}
		else{
			$(".tpasim_body_temps_alertMessage").hide()
			$(".tpasim_body_temps_alertCnatDelete").show()
		}
		$(".tpasim_body_temps_alert_text span").text(tempNameGlobal);
		$(".tpasim_body_temps_alert, .tpasim_body_temps_alertHolder").fadeIn()
	}
	function closePopUp(){
		$(".tpasim_body_temps_alertHolder, .tpasim_body_temps_alert").fadeOut();
		$(".tpasim_body_temps_folderAll_deleteBlock, .tpasim_body_temps_folderAll_delete").fadeOut();
	}
	function deleteFile(){
		var id = $(".tpasim_body_temps_folderAll_delete_id").text()
		$(".tpasim_body_temps_alert_submitRow_loader").show()
		
		$.ajax({
			type: 'GET',
			url: '/api/deleteTempAll/',
			data:{
				id: id
			},
			dataType: 'text',
			success: function(json) {
				$(".tpasim_body_temps_alert_submitRow_loader").hide();
				$(".tpasim_body_temps_folderAll_delete, .tpasim_body_temps_folderAll_deleteBlock").hide();
				if(json=="-1"){
					window.location = '/#login';	
				}
				$(".tpasim_body_temps_deleteButtonAll, .tpasim_body_temps_changeTempNameAll").hide();
			},error: function(){
			}
		});
	}
}

