var maharah = new maharahJs()
function maharahJs(){
	function create(){
		editor = CKEDITOR.replace( 'tpasim_body_temps_maharah_row_textarea', {
		    language: 'he'
		});
		$(".tpasim_body_temps_maharah_row_submit1").click(bigSave);
		$(".tpasim_body_temps_maharah_row_delete:eq(0)").click(deleteFile1);
		$(".tpasim_body_temps_maharah_row_delete:eq(1)").click(deleteFile2);
		$(".tpasim_body_temps_maharah_row_delete:eq(2)").click(deleteFile3);
		$(".tpasim_body_temps_maharah_row_delete:eq(3)").click(deleteFile4);
		
		$(".tpasim_body_temps_maharah_row_save1").click(addFileHolder1)
		$(".tpasim_body_temps_maharah_row_save2").click(addFileHolder2)
		$(".tpasim_body_temps_maharah_row_save3").click(addFileHolder3)
		$(".tpasim_body_temps_maharah_row_save4").click(addFileHolder4)
	}
	this.create = create;
	var editor;
	function showMaharah(){

		var id = $(this).parent().parent().find(".tpasim_body_temps_rowAll_id").text()
		
		getMaharah(id);
		getNameOfFiles();
		
		if($.userAdmin!=1){
			editor.readOnly=true;
			$(".tpasim_body_temps_maharah_row_selectTwo, .tpasim_body_temps_maharah_row_select").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_input").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_inputFile1").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_inputFile2").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_inputFile3").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_inputFile4").prop('disabled', true);
			$(".tpasim_body_temps_maharah_row_submit1").hide()
			
			$(".tpasim_body_temps_maharah_row_admin").hide()
			$(".tpasim_body_temps_maharah_row_notAdmin").show()
			
			
		}
		else{
			$(".tpasim_body_temps_maharah_row_admin").show()
			$(".tpasim_body_temps_maharah_row_notAdmin").hide()
		}
	}
	this.showMaharah = showMaharah;
	function getNameOfFiles(){
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
	function echoFolders(json){
		var loopLength = json.length
		
		var clone2 = $(".tpasim_body_temps_maharah_row_select option:first").clone();
		$(".tpasim_body_temps_maharah_row_select option").remove();
		$(".tpasim_body_temps_maharah_row_select").append(clone2);
		$(".tpasim_body_temps_maharah_row_select").click(showTempTwoFirst);
		for(var i=0; i<loopLength ;i++){
			$(".tpasim_body_temps_maharah_row_select").append("<option value=" + json[i].id + ">" + json[i].temp + "</option>");
		}		
	}
	function showTempTwoFirst(){
		var temp = $(this).find("option:selected").text();
		showTempTwo(temp)
	}
	function showTempTwo(temp){
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
					var json = $.parseJSON(data)
					echoSelectOptionTwo(json,0)
				}
			}
		});
	}
	function echoSelectOptionTwo(json,nameToSelect){
		if(json.length!=0){
			$(".tpasim_body_temps_maharah_row_selectTwo2").show();
			$(".tpasim_body_temps_maharah_row_selectTwo").find("option").remove();
			$(".tpasim_body_temps_maharah_row_selectTwo").append("<option value='0'>תיקיה ראשית</option>")
			
			for(var i=0; i<json.length ;i++){
				$(".tpasim_body_temps_maharah_row_selectTwo").append("<option value=" + json[i].id + ">" + json[i].temp + "</option>")
			}
			
			$(".tpasim_body_temps_maharah_row_selectTwo").val(nameToSelect);
			
		}
		else{
			$(".tpasim_body_temps_maharah_row_selectTwo2").hide();
		}
	}
	function getMaharah(id){
		$.ajax({
			type: 'GET',
			url: '/api/showMaharah/',
			data: {
				id: id
			},
			dataType: 'text',
			success: function(json) {
				json = JSON.parse(json);

				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					echoMhaharah(json)
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	function echoMhaharah(json){
		$(".tpasim_body_temps_folder, .tpasim_body_temps_menuHeaderHide").hide()
		$(".tpasim_body_temps_maharah").fadeIn();
		
		$(".tpasim_body_temps_maharah_row_id").text(json[0].id);
		
		$(".tpasim_body_temps_maharah_row_download_href:eq(0)").attr("href","/files/" + json[0].filePath1 + "/?id=" + $.user['id'] + "&place=1");
		$(".tpasim_body_temps_maharah_row_download_href:eq(1)").attr("href","/files/" + json[0].filePath2 + "/?id=" + $.user['id'] + "&place=2");
		$(".tpasim_body_temps_maharah_row_download_href:eq(2)").attr("href","/files/" + json[0].filePath3 + "/?id=" + $.user['id'] + "&place=3");
		$(".tpasim_body_temps_maharah_row_download_href:eq(3)").attr("href","/files/" + json[0].filePath4 + "/?id=" + $.user['id'] + "&place=4");
		$(".tpasim_body_temps_maharah_row_input").val(json[0].name)
		editor.setData(json[0].text)
		$(".tpasim_body_temps_maharah_row_texttext").html(json[0].text);
		
		if(json[0].filePath1==""){
			if($.userAdmin!=1){
				$(".tpasim_body_temps_maharah_fileRow:eq(0)").hide()
			}
			
			$(".tpasim_body_temps_maharah_row1:eq(0)").hide();
			$(".tpasim_body_temps_maharah_row_download:eq(0)").hide();
			$(".tpasim_body_temps_maharah_row_delete:eq(0)").hide();
			$(".tpasim_body_temps_maharah_row2:eq(0)").show();
			$(".tpasim_body_temps_maharah_row_save:eq(0)").show()
		}
		else{
			$(".tpasim_body_temps_maharah_row1:eq(0)").show();
			$(".tpasim_body_temps_maharah_row_download:eq(0)").show();
			$(".tpasim_body_temps_maharah_row_delete:eq(0)").show();
			$(".tpasim_body_temps_maharah_row2:eq(0)").hide();
			$(".tpasim_body_temps_maharah_row_save:eq(0)").hide()
		}
		
		if(json[0].filePath2==""){
			if($.userAdmin!=1){
				$(".tpasim_body_temps_maharah_fileRow:eq(1)").hide()
			}
			
			$(".tpasim_body_temps_maharah_row1:eq(1)").hide();
			$(".tpasim_body_temps_maharah_row_download:eq(1)").hide();
			$(".tpasim_body_temps_maharah_row_delete:eq(1)").hide();
			$(".tpasim_body_temps_maharah_row2:eq(1)").show();
			$(".tpasim_body_temps_maharah_row_save:eq(1)").show()
		}
		else{
			$(".tpasim_body_temps_maharah_row1:eq(1)").show();
			$(".tpasim_body_temps_maharah_row_download:eq(1)").show();
			$(".tpasim_body_temps_maharah_row_delete:eq(1)").show();
			$(".tpasim_body_temps_maharah_row2:eq(1)").hide();
			$(".tpasim_body_temps_maharah_row_save:eq(1)").hide()
		}
		
		if(json[0].filePath3==""){
			if($.userAdmin!=1){
				$(".tpasim_body_temps_maharah_fileRow:eq(2)").hide()
			}
			$(".tpasim_body_temps_maharah_row1:eq(2)").hide();
			$(".tpasim_body_temps_maharah_row_download:eq(2)").hide();
			$(".tpasim_body_temps_maharah_row_delete:eq(2)").hide();
			$(".tpasim_body_temps_maharah_row2:eq(2)").show();
			$(".tpasim_body_temps_maharah_row_save:eq(2)").show()
		}
		else{
			$(".tpasim_body_temps_maharah_row1:eq(2)").show();
			$(".tpasim_body_temps_maharah_row_download:eq(2)").show();
			$(".tpasim_body_temps_maharah_row_delete:eq(2)").show();
			$(".tpasim_body_temps_maharah_row2:eq(2)").hide();
			$(".tpasim_body_temps_maharah_row_save:eq(2)").hide()
		}
		
		if(json[0].filePath4==""){
			if($.userAdmin!=1){
				$(".tpasim_body_temps_maharah_fileRow:eq(3)").hide()
			}
			$(".tpasim_body_temps_maharah_row1:eq(3)").hide();
			$(".tpasim_body_temps_maharah_row_download:eq(3)").hide();
			$(".tpasim_body_temps_maharah_row_delete:eq(3)").hide();
			$(".tpasim_body_temps_maharah_row2:eq(3)").show();
			$(".tpasim_body_temps_maharah_row_save:eq(3)").show()
		}
		else{
			$(".tpasim_body_temps_maharah_row1:eq(3)").show();
			$(".tpasim_body_temps_maharah_row_download:eq(3)").show();
			$(".tpasim_body_temps_maharah_row_delete:eq(3)").show();
			$(".tpasim_body_temps_maharah_row2:eq(3)").hide();
			$(".tpasim_body_temps_maharah_row_save:eq(3)").hide()
		}
		
		$(".tpasim_body_temps_maharah_row_text:eq(0)").text(decodeURIComponent(json[0].filePath1))
		$(".tpasim_body_temps_maharah_row_text:eq(1)").text(decodeURIComponent(json[0].filePath2))
		$(".tpasim_body_temps_maharah_row_text:eq(2)").text(decodeURIComponent(json[0].filePath3))
		$(".tpasim_body_temps_maharah_row_text:eq(3)").text(decodeURIComponent(json[0].filePath4))
		
		$(".tpasim_body_temps_maharah_row_textView:eq(0)").text(json[0].view1)
		$(".tpasim_body_temps_maharah_row_textView:eq(1)").text(json[0].view2)
		$(".tpasim_body_temps_maharah_row_textView:eq(2)").text(json[0].view3)
		$(".tpasim_body_temps_maharah_row_textView:eq(3)").text(json[0].view4)
		
		if($.userAdmin!=1){
			$(".tpasim_body_temps_maharah_row_delete").hide()
			$(".tpasim_body_temps_maharah_row_save").hide()
		}
		
		var temps_id = (json[0].temps_id);
		chooseTempsById(temps_id);
	}
	function chooseTempsById(temps_id){
		// temps_id = 39;
		
		$.ajax({
			type: 'GET',
			url: '/api/getTempsForEdit/',
			data: {
				temp_id: temps_id
			},
			dataType: 'text',
			success: function(json) {
				json = JSON.parse(json);
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					chooseTemp(json);
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	function chooseTemp(json){
		var mainTemp = json[0].mainTemp;
		var temp = json[0].temp;
		var tempId = json[0].id;

		if(mainTemp == 0){
			$(".tpasim_body_temps_maharah_row_select").val(tempId)
			showTempTwoFromEdit(temp,tempId)
		}
		else{
			$(".tpasim_body_temps_maharah_row_select").val(mainTemp);
			var loopLength = $(".tpasim_body_temps_maharah_row_select option").length;
			for(var i=0; i<loopLength ;i++){
				var tempName = $(".tpasim_body_temps_maharah_row_select option:eq(" + i + ")").text()
				if(tempName == mainTemp){
					var newId = $(".tpasim_body_temps_maharah_row_select option:eq(" + i + ")").attr("value");
					$(".tpasim_body_temps_maharah_row_select").val(newId)
					showTempTwoFromEdit(tempName,tempId)
				}
			}
		}
	}
	function showTempTwoFromEdit(temp,newId){
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
					var json = $.parseJSON(data)
					echoSelectOptionTwo(json,newId)
				}
			}
		});
	}
	function bigSave(){
		var id = $(".tpasim_body_temps_maharah_row_id").text();
		var firstTempId = $(".tpasim_body_temps_maharah_row_select").attr("value")
		var secondTempId = $(".tpasim_body_temps_maharah_row_selectTwo").attr("value")
		var tempId = 0;
		$(".tpasim_body_temps_maharah_row_loader100").show()

		if(firstTempId == 0){
			tempId = 0;
		}
		else{
			if(secondTempId==0){
				tempId = firstTempId;
			}
			else{
				tempId = secondTempId;
			}
		}
		
		// alert(tempId)
		var text = editor.getData();
		var title = $(".tpasim_body_temps_maharah_row_input").val();
		
		$.ajax({
			type: 'GET',
			url: '/api/editFile/',
			data:{
				title: title,
				text: text,
				temp_id: tempId,
				id:id
			},
			dataType: 'text',
			success: function(json) {

				// json = JSON.parse(json)
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					$(".tpasim_body_temps_maharah_row_loader100").hide();
					$(".tpasim_body_temps_maharah_row_ok").show();
					setTimeout(function(){
						$(".tpasim_body_temps_maharah_row_ok").hide();
					},3000)
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
	function deleteFile1(){
		// $(this).hide()
		$(".tpasim_body_temps_maharah_row_loader:eq(0)").show()
		deleteFile(1)
	}
	function deleteFile2(){
		// $(this).hide()
		$(".tpasim_body_temps_maharah_row_loader:eq(1)").show()
		deleteFile(2)
	}
	function deleteFile3(){
		// $(this).hide()
		$(".tpasim_body_temps_maharah_row_loader:eq(2)").show()
		deleteFile(3)
	}
	function deleteFile4(){
		// $(this).hide()
		$(".tpasim_body_temps_maharah_row_loader:eq(3)").show()
		deleteFile(4)
	}
	function addFileHolder1(){
		addFile(1);
	}
	function addFileHolder2(){
		addFile(2);
	}
	function addFileHolder3(){
		addFile(3);
	}
	function addFileHolder4(){
		addFile(4);
	}
	function addFile(pathNumber){
		$(".tpasim_body_temps_maharah_row_loader1:eq(" + (pathNumber-1) + ")").show();
		
		setTimeout(function(){
			var id = $(".tpasim_body_temps_maharah_row_id").text()
			var filePath2 = $(".tpasim_body_temps_maharah_row_inputFile" + pathNumber).val().split('\\').pop();
			
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
							$(".tpasim_body_temps_maharah_row_download_href:eq(" + (pathNumber-1) + ")").attr("href","/files/" + filePath2)
							$(".tpasim_body_temps_maharah_row_text:eq(" + (pathNumber-1) + ")").text(filePath2);
							$(".tpasim_body_temps_maharah_row_loader1:eq(" + (pathNumber-1) + ")").hide();
							$(".tpasim_body_temps_maharah_row1:eq(" + (pathNumber-1) + ")").show();
							$(".tpasim_body_temps_maharah_row_download:eq(" + (pathNumber-1) + ")").show();
							$(".tpasim_body_temps_maharah_row_delete:eq(" + (pathNumber-1) + ")").show();
							$(".tpasim_body_temps_maharah_row2:eq(" + (pathNumber-1) + ")").hide();
							$(".tpasim_body_temps_maharah_row_save:eq(" + (pathNumber-1) + ")").hide()
						},1000)
					}
				}
			});
		},1000)
	}
	function deleteFile(fileNumber){
		var id = $(".tpasim_body_temps_maharah_row_id").text();
		
		$.ajax({
			type: 'GET',
			url: '/api/deleteFile/',
			data:{
				fileNumber: fileNumber,
				id: id
			},
			dataType: 'text',
			success: function(json) {
				json = JSON.parse(json)
				if(json=="-1"){
					window.location = '/#login';	
				}
				else{
					setTimeout(function(){
						$(".tpasim_body_temps_maharah_row_loader:eq(" + (fileNumber-1) + ")").hide()
						$(".tpasim_body_temps_maharah_row1:eq(" + (fileNumber-1) + ")").hide();
						$(".tpasim_body_temps_maharah_row_download:eq(" + (fileNumber-1) + ")").hide();
						$(".tpasim_body_temps_maharah_row_delete:eq(" + (fileNumber-1) + ")").hide();
						$(".tpasim_body_temps_maharah_row2:eq(" + (fileNumber-1) + ")").show();
						$(".tpasim_body_temps_maharah_row_save:eq(" + (fileNumber-1) + ")").show()
					},1000)
				}
			},error:function(json){
				// window.location = '/#login';	
			}
		});
	}
}