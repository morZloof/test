var petek = new petekJs()
function petekJs(){
	function ctor(){
		showPage()
	}
	this.ctor = ctor;
	
	var ifLoad = 0;
	function showPage(){
		if(ifLoad==0){
			ifLoad = 1;
			getData();
		}
		$(".global_page_petek").show()
	}
	this.showPage = showPage;
	function getData(){
		var data = {}

		var url = '/api/header/getPetek/';
		
		global.api(url,data,function(data){
			
			var json = JSON.parse(data)

			echoData(json);
			setInterval(function(){
				echoData(json);
			},5000)
		})
	
	} 
	function echoData(json){
		var randomNumber = Math.floor(Math.random() * json.length);
		
		var line = json[randomNumber].line;
		var name = json[randomNumber].name;
		var company = json[randomNumber].company;
		
		$(".petek_line").text('"' + line + '"')
		$(".petek_name").text(name)
		$(".petek_title").text(company)
	}
}