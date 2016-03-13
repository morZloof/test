var mUsers = new mUsersJs()
function mUsersJs(){
	function ctor(){
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide()
		$(".global_page_mUsers").show()
		
		getData()
	}
	this.showPage = showPage;
    
     function user_id(){
        var query = String(window.location);
	    var userId = query.substring((query.indexOf('=') + 1));
	    return userId;
    }    
    
    function getData(){
        var data = {
            userId: user_id()
        }
        
        var url = '/api/mentor/getUserById/';

        global.api(url,data,function(data){
            var json = JSON.parse(data);
            
            var userJson = json[0][0];
            var userDisputes = json[1];
            var countVotes = json[2][0].counter;
            var countBrainstorm = json[3][0].counter;
            var date = userJson.date.split('T')[0];
            
            echoDisputes(userDisputes);
            
            $(".mUsers_title span").text(decodeURIComponent(userJson.firstName))
            $(".mUsers_users_row1 span").text(date);
            $(".mUsers_users_row2 span").text(countVotes);
            $(".mUsers_users_row3 span").text(countBrainstorm);
            $(".mUsers_users_row4 span").text(parseMainTagToString(userJson.level));
            $(".mUsers_users_row5 span").text(userJson.points);
            $(".mUsers_users_row6 span").text(userJson.email);
        })
    }
    
    function echoDisputes(json){
        var loopLength = json.length;
        
        var clone = $(".mUsers_brainstorm_box:first").clone();
        $(".mUsers_brainstorm_box").remove();
        $(".mUsers_brainstormHolder").append(clone);
        
        if(loopLength==undefined){
            return;
        }
        
        for(var i=0;i<loopLength ;i++)
        {
            var clone = $(".mUsers_brainstorm_box:first").clone();

            clone.find(".mUsers_brainstorm_box_text").text(decodeURIComponent(json[i].title));
            $(".mUsers_brainstormHolder").append(clone);
            
            clone.click({disputeId:json[i].id} , goToDispute);
            clone.show()
        }
    }
    
    function goToDispute(e){
        var disputeId= e.data.disputeId;
        
        location.href = '/#mDispute?disputeId=' + disputeId;
    }
    
    function parseMainTagToString(tagNumber) {
		var tagString = 'אין';
		switch(tagNumber) {
			case 1:
				tagString = 'relations';
			break;
			case 2:
				tagString = 'commercial';
			break;
			case 3:
				tagString = 'virtual';
			break;
			case 4: 
				tagString = 'accomodation';
			break;
		}

		return tagString;
	}
}