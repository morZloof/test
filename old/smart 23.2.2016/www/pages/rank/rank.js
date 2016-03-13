var rank = new rankJs()
function rankJs(){
	function ctor(){
        $(".rank_mission6_text_submit").click(goToDashboard);
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide();
		bgElements.showPage();
		$(".global_page_rank").show();

		getData();
        
        if($.globalUser.mentor==6){
            $(".header").hide()
            $(".header_bottomHeader_mission6").fadeOut(100)
            $(".mentor_block").show()
            
            $(".rank_mission6_text").show()
            $(".rank_yourRank_row").addClass("mentor_notBlock")
            $(".rank_mission6").show()
        }
        else{
            clearInterval($.mentor_level6)
            $(".header_bottomHeader_mission6").fadeOut(100)
            $(".mentor_block, .rank_mission6_text, .rank_mission6").hide()
        }
	}
	this.showPage = showPage;
	
    function goToDashboard(){
        $(".header").show()
        
        $.globalUser.mentor=7;
        mentor.updateMentor();
        global.showDashboard()
    }
	function getData(){
		var url = "/api/rank/getTopTen/"
		var data = {}
	
		global.api(url,data,function(data){
			var json = JSON.parse(data)
            
            echoMyRank();
			echoTop10(json);
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
	
	function echoMyRank(){
		var rank = $.globalUser.rank;	
		rank = help.addComma(rank);
		
		$(".rank_yourRank span").text(rank)
	} 
}