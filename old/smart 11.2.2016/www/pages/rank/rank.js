var rank = new rankJs()
function rankJs(){
	function ctor(){
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide();
		bgElements.showPage();
		$(".global_page_rank").show();

		getData()
	}
	this.showPage = showPage;
	
	function getData(){
		var url = "/api/rank/getTopTen/"
		var data = {}
	
		global.api(url,data,function(data){
			var json = JSON.parse(data)
			echoTop10(json[0]);
			echoMyRank(json[1]);
		})
	}
	function echoTop10(json){
		var loopLength = json.length
		
		var clone = $(".rank_table_row1:first").clone()
		$(".rank_table_row1").remove();
		$(".rank_table").append(clone);
		
		for(var i=0; i<loopLength ;i++)
		{
			var clone = $(".rank_table_row1:first").clone()
			
			clone.find(".rank_table_row_li_rank").text(i+1);
			clone.find(".rank_table_row_li_userName").text(json[i].userName);
			clone.find(".rank_table_row_li_power").text(json[i].profit);
			
			clone.find(".rank_table_row_li_userName").click({userId:json[i].id},goToUserProfile)	
			
			$(".rank_table").append(clone)
			clone.show()
		}
	}
	
	function goToUserProfile(e){
		var userId = e.data.userId
		
		profile.showPage(userId);
	}
	
	function echoMyRank(json){
		var rank = json[0].rank;	
		rank = help.addComma(rank);
		
		$(".rank_yourRank span").text(rank)
	} 
}