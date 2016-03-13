var tpasim = new tpasimJS()
function tpasimJS (){
	var firstTime=0;
	function create(){
		if(firstTime==0){
			firstTime=1;
			$(".tpasim_header_menu:eq(0)").click(showTemps);
			$(".tpasim_header_menu:eq(1)").click(showAddFolder);
			$(".tpasim_header_menu:eq(2)").click(showAddTopes);
			$(".tpasim_body_temps_addButtonAll").click(showAddFolderTwo);
			$(".tpasim_header_menu").click(addClassColor);
	
			$(".tpasim_body_addTemp_submit").click(addTemp);
			editor = CKEDITOR.replace( 'editor1', {
				language: 'he'
			});
			
			$(".tpasim_body_addTopes_row_select").click(selectOptionTwo)
			$(".tpasim_body_addFile_submit1").click(addFile);
			
			$(".tpasim_body_addTopas_holderTow_row:eq(0)").show();
			$(".tpasim_body_addTopas_holderTow_plus1").click(openRow2);
			$(".tpasim_body_addTopas_holderTow_plus2").click(openRow3);
			$(".tpasim_body_addTopas_holderTow_plus3").click(openRow4);
			
			$(".tpasim_body_addFile_submit2").click(firstAddFile2);
			$(".tpasim_body_addFile_submit3").click(firstAddFile3);
			$(".tpasim_body_addFile_submit4").click(firstAddFile4);
			
			getFolders()
			$(".tpasim_body_addTopes_row_selectnew").click(openMenu)
		}
	}
	this.create = create;
	var editor;
	function showPage(){
		$(".menu_mini_tpasim").addClass("menu_miniAddClass")
		tpasimBodyTemps.showPage();
	}
	this.showPage = showPage;
	
	function getFolders(){
		$.ajax({
			type: 'GET',
			url: '/api/nameOfAllFolders',
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
	function selectTemp(){
		var text = $(this).text()
		var id = $(this).attr('value')
		
		$(".tpasim_body_addTopes_row_selectnew").find("span").remove();
		$(".tpasim_body_addTopes_row_selectnew").append('<span class="glyphicon glyphicon-chevron-down"></span>');
		
		$(".tpasim_body_addTopas_id").text(id)
		$(".tpasim_body_addTopes_row_selectnew_text").text(text)
		$(".tpasim_body_addTopes_row_list").hide()
		ifOpen=0;
	}
	function echoFolders(json){
		var loopLength = json.length;
		
		var clone = $(".tpasim_body_addTopes_row_lise_menu:first").clone()
		$(".tpasim_body_addTopes_row_lise_menu").remove();
		$(".tpasim_body_addTopes_row_list").append(clone);
		
		for(var i=0; i<loopLength ;i++)
		{
			clone = $(".tpasim_body_addTopes_row_lise_menu:first").clone()
			if(json[i].mainTemp=="0"){
				
				var tempName = json[i].temp 
				clone.text(tempName)
				clone.attr("value",json[i].id)
				$(".tpasim_body_addTopes_row_list").append(clone);
				
				for(var j=0; j<loopLength ; j++)
				{
					if(tempName == json[j].mainTemp){
						clone = $(".tpasim_body_addTopes_row_lise_menu:first").clone()
						clone.attr("value",json[j].id)
						clone.text(json[j].temp)
						clone.css("right","25px")
						
						$(".tpasim_body_addTopes_row_list").append(clone);
					}
					
				}
			}
			clone.show();
		}
		$(".tpasim_body_addTopes_row_lise_menu").click(selectTemp);
	}
	var ifOpen = 0;
	function openMenu(){
		if(ifOpen==0){
			ifOpen=1;
			$(".tpasim_body_addTopes_row_selectnew").find("span").remove()
			$(".tpasim_body_addTopes_row_selectnew").append('<span class="glyphicon glyphicon-chevron-up"></span>')
			$(".tpasim_body_addTopes_row_list").show()
		}
		else{
			ifOpen=0;
			$(".tpasim_body_addTopes_row_selectnew").find("span").remove();
			$(".tpasim_body_addTopes_row_selectnew").append('<span class="glyphicon glyphicon-chevron-down"></span>');
			$(".tpasim_body_addTopes_row_list").hide()
		}
	}
	function admin(){
		if($.userAdmin==0 || $.userAdmin==2){
			$(".tpasim_header_menu:eq(1)").hide()
			$(".tpasim_header_menu:eq(2)").hide()
		}
		else{
			$(".tpasim_header_menu:eq(1)").show()
			$(".tpasim_header_menu:eq(2)").show()
		}
	}
	this.admin = admin;
	
	function firstAddFile2(){
		addFile2(2);
	}
	function firstAddFile3(){
		addFile2(3);
	}
	function firstAddFile4(){
		addFile2(4);
	}
	function addFile2(pathNumber){
		
		$(".tpasim_body_addFile_submit" + pathNumber).addClass("tpasim_body_addFile_submitAddClass")
		setTimeout(function(){
			$(".tpasim_body_addFile_submit" + pathNumber).hide();
			$(".tpasim_body_addFile_loader" + pathNumber).show();
		},300)
		
		setTimeout(function(){
			var id = $(".tpasim_body_addTopas_id").text()
			var filePath2 = $(".tpasim_body_addTopas_file" + pathNumber).val().split('\\').pop();

			$.ajax({
				type: 'GET',
				url: '/api/addFileToTemp/',
				data:{
					pathNumber: pathNumber,
					temp_id: id,
					filePath: filePath2
				},
				dataType: 'text',
				success: function(data) {
					if(data=="-1"){
						window.location = '/#login';	
					}
					else{
						setTimeout(function(){
							$(".tpasim_body_addFile_submit" + pathNumber).removeClass("tpasim_body_addFile_submitAddClass");
							$(".tpasim_body_addFile_ok" + pathNumber).show();
							$(".tpasim_body_addFile_loader" + pathNumber).hide();
							
							if(pathNumber==2){
								showRow3()
							}
							if(pathNumber==3){
								showRow4()
							}
						},1000)
						setTimeout(function(){
							$(".tpasim_body_addFile_ok2").hide();
						},4000)
					}
				}
			});
		},2000)
	}
	function showRow3(){
		
		$(".tpasim_body_addTopas_holderTow_row3").show()
	}
	function showRow4(){
		$(".tpasim_body_addTopas_holderTow_row4").show()
	}
	function selectOptionTwo(){
		var temp = $(this).find("option:selected").text();

		$.ajax({
			type: 'GET',
			url: '/api/nameOfTemps1/',
			data:{
				temp: temp
			},
			dataType: 'text',
			success: function(data) {
				if(data=="-1"){
					window.location = '/#login';	
				}
				else{
					echoSelectOptionTwo(data)
				}
			}
		});
	}
	function echoSelectOptionTwo(data){
		if(data.length!=0){
			var json = $.parseJSON(data)
			$(".tpasim_body_addTemp_row_selectTwo").show();
			$(".tpasim_body_addTemp_row_selectTwo").find("option").remove();
			$(".tpasim_body_addTopes_row_selectTwo").append("<option value='0'>תיקיה ראשית</option>")
			
			for(var i=0; i<json.length ;i++){
				$(".tpasim_body_addTopes_row_selectTwo").append("<option value=" + json[i].id + ">" + json[i].temp + "</option>")
			}
		}
		else{
			$(".tpasim_body_addTemp_row_selectTwo").hide();
		}
	}
	function openRow2(){
		$(".tpasim_body_addTopas_holderTow_row2").slideDown()
	}
	function openRow3(){
		$(".tpasim_body_addTopas_holderTow_row3").slideDown()
	}
	function openRow4(){
		$(".tpasim_body_addTopas_holderTow_row4").slideDown()
	}
	function addFile(){
		var title = $(".tpasim_body_addTemp_row_input11").val();
		var text = editor.getData();
		var tempMainId = $(".tpasim_body_addTopes_row_select option:selected").attr("value");
		var tempSubMainId = $(".tpasim_body_addTopes_row_selectTwo option:selected").attr("value");
		var tempId = "0";
		var filePath1 = $(".tpasim_body_addTopas_file1").val().split('\\').pop();
		var filePath2 = $(".tpasim_body_addTopas_file2").val().split('\\').pop();
		var filePath3 = $(".tpasim_body_addTopas_file3").val().split('\\').pop();
		var filePath4 = $(".tpasim_body_addTopas_file4").val().split('\\').pop();
		var fileName1 = $(".tpasim_body_addTemp_row_input1").val();
		var fileName2 = $(".tpasim_body_addTemp_row_input2").val();
		var fileName3 = $(".tpasim_body_addTemp_row_input3").val();
		var fileName4 = $(".tpasim_body_addTemp_row_input4").val();

		if(title.length>2){
			$(".tpasim_body_addFile_submit1").addClass("tpasim_body_addFile_submitAddClass")
			setTimeout(function(){
				$(".tpasim_body_addFile_submit1").hide();
				$(".tpasim_body_addFile_loader1").show();
			},300)
			
			if(tempMainId == "0"){
				tempId = "0";
			}
			else if(tempSubMainId == "0"){
				tempId = tempMainId;
			}
			else{
				tempId = tempSubMainId;
			}
			
			tempId = $(".tpasim_body_addTopas_id").text()
			
			$(".tpasim_body_addTemp_loader").show();
			$.ajax({
				type: 'GET',
				url: '/api/addFile/',
				data:{
					tempName: title,
					fileText: text,
					tempMainId: tempId,
					filePath1 : filePath1,
					filePath2 : filePath2,
					filePath3 : filePath3,
					filePath4 : filePath4,
					fileName1 : fileName1,
					fileName2 : fileName2,
					fileName3 : fileName3,
					fileName4 : fileName4
				},
				dataType: 'text',
				success: function(data) {
					json = JSON.parse(data)
					setTimeout(function(){
						if(data=="-1"){
							window.location = '/#login';	
						}
						else{
							$(".tpasim_body_addTopas_id").text(json[0].id);
							$(".tpasim_body_addTopas_holderTow_row2").show()
							$(".tpasim_body_addFile_submit1").removeClass("tpasim_body_addFile_submitAddClass");
							$(".tpasim_body_addFile_submit1, .tpasim_body_addFile_ok1").show();
							$(".tpasim_body_addFile_loader1").hide();
							
							hideFile1()
						}
					},1000)
				}
			});
		}
		else{
			$(".tpasim_body_addTopas_holderTow_error").fadeIn()
			setTimeout(function(){
				$(".tpasim_body_addTopas_holderTow_error").fadeOut()
			},4000)
		}
		
	}
	function hideFile1(){
		$(".tpasim_body_addFile_ok1").hide();
		$(".tpasim_body_addFile_submit1").hide();
		$(".tpasim_body_addTopas_holder").hide();
		$(".tpasim_body_addTemp_row1").hide();
		
		$(".tpasim_body_addTopas_holderTow_row1").hide()
		$(".tpasim_body_addTopas_holderTow_row2").show()
	}
	function showAddFolder(){
		$(".tpasim_body_temps, .tpasim_body_addTopas").fadeOut(400);
		setTimeout(function(){
			$(".tpasim_body_addTemp").fadeIn(400);
		},390)
	}
	function showTemps(){
		$(".tpasim_body_addTemp, .tpasim_body_addTopas").fadeOut(400);
		setTimeout(function(){
			$(".tpasim_body_temps").fadeIn();
		},390)
		
		tpasimBodyTemps.showPage()
	}
	function showAddTopes(){
		tpasimBodyTemps.getData()
		editor.setData("");
		$(".tpasim_body_addFile_ok").hide();
		$(".tpasim_body_addFile_submit").show();
		$(".tpasim_body_addFile_submit1").show();
		$(".tpasim_body_addTopas_holder").show();
		$(".tpasim_body_addTemp_row1").show();
		
		$(".tpasim_body_addTopas_holderTow_row1").show()
		$(".tpasim_body_addTopas_holderTow_row2, .tpasim_body_addTopas_holderTow_row3, .tpasim_body_addTopas_holderTow_row4").hide()
		
		$(".tpasim_body_addTopas_file").val("");
		$(".tpasim_body_addTemp_row_input").val("");
		
		$(".tpasim_body_addTemp, .tpasim_body_temps").fadeOut(400);
		setTimeout(function(){
			$(".tpasim_body_addTopas").fadeIn();
		},390)
	}
	function addClassColor(){
		$(".tpasim_header_menu").removeClass("tpasim_header_menuClick");
		$(this).addClass("tpasim_header_menuClick");
	}
	function showAddFolderTwo(){
		$(".tpasim_header_menu").removeClass("tpasim_header_menuClick");
		$(".tpasim_header_menu:eq(1)").addClass("tpasim_header_menuClick");
		showAddFolder()
	}
	function addTemp(){
		$(".tpasim_body_addTemp_submit").addClass("tpasim_body_addTemp_submitAddClass")
		$(".tpasim_body_addTemp_submit").fadeOut(300);
		
		var tempMain = $(".tpasim_body_addTemp_row_select option:selected").text();
		
		setTimeout(function(){
			$(".tpasim_body_addTemp_loader").show();
		},300)
		
		var tempName = $(".tpasim_body_addTemp_row_input").val();
		
		if(tempMain=="תיקיה ראשית"){
			tempMain = "0";
		}
		
		$.ajax({
			type: 'GET',
			url: '/api/addTemp/',
			data:{
				tempMain: tempMain,
				tempName: tempName
			},
			dataType: 'json',
			success: function(json) {
				sucssesAddTemp(json);
			},
			error: function(json){
			}
		});
	}
	function sucssesAddTemp(json){
		$(".tpasim_body_addTemp_row_input").val('');
		setTimeout(function(){
			$(".tpasim_body_addTemp_submit").removeClass("tpasim_body_addTemp_submitAddClass")
			$(".tpasim_body_addTemp_loader").hide();
			$(".tpasim_body_addTemp_submit").show();
			$(".tpasim_body_addTemp_ok").fadeIn()
			tpasimBodyTemps.echoFolders(json);
		},1000)
		setTimeout(function(){
			$(".tpasim_body_addTemp_ok").fadeOut()
		},3000)
	}
}
