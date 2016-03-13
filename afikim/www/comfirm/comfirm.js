var comfirm = new comfirmJS();
function comfirmJS(){
	var editor;
	function create(){
		$(".comfirm_submit").click(editComfirm);
		$(".comfirm_box_all_submit").click(checkComfirm);
		
		editor = CKEDITOR.replace( 'comfirm_editor', {
			language: 'he'
		});
		
		checkIfComfirm()
	}
	this.create = create;
	
	function showPage(){
		if($.userAdmin != 1){
			$(".comfirm_submit").hide()
		}
		
		pages.globalHide()
		$(".comfirm").show()
		getData();
	}
	this.showPage = showPage;
	
	function getData(){
		$.ajax({
			type: 'GET',
			url: '/api/comfirm/showComfirm/',
			dataType: 'text',
			success: function(data) {
				if(data=="-1"){
					window.location = '/#login';	
				}
				else{
					var json = JSON.parse(data)
					editor.setData(json[0].text)
				}
			},error:function(text){
				console.log(text)
				// window.location = '/#login';	
			}
		});
	}
	function editComfirm(){
		var text = editor.getData();
		
		$(".comfirm_loader").show()
		$.ajax({
			type: 'GET',
			url: '/api/comfirm/updateComfirm/',
			data:{
				text: text
			},
			dataType: 'text',
			success: function(data) {
				if(data=="-1"){
					window.location = '/#login';	
				}
				else{
					$(".comfirm_ok").fadeIn()
					$(".comfirm_loader").hide()
					setTimeout(function(){
						$(".comfirm_ok").fadeOut()
					},3000)
				}
			},error:function(text){
				console.log(text)
				// window.location = '/#login';	
			}
		});
	}
	
	function checkIfComfirm(){
		setTimeout(function(){
			if($.user['firstTime']==0){
				$(".comfirm_box_block, .comfirm_box_all").show()
			}
		},100)
	}
	
	function checkComfirm(){
		var ifCheck = $(".confirm_box_all_comfirmText_input").is(':checked') 
		
		$(".comfirm_box_all_submit_error").hide()
		
		if(ifCheck == false){
			$(".comfirm_box_all_submit_error").fadeIn()
		}
		else{
			doCheck()
		}
	}
	function doCheck(){
		$(".comfirm_box_block, .comfirm_box_all").fadeOut()
		
		$.ajax({
			type: 'GET',
			url: '/api/comfirm/doComfirm',
			dataType: 'text',
		});
	}
}