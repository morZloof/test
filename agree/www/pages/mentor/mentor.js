var mentor = new mentorJs()
function mentorJs(){
	function ctor(){
        $(".mentor_openDispute").click(showDispute);
        $(".mentor_openUsers").click(showUsers);
        $(".mentor_dispute_search").keydown(searchDispute);
        $(".mentor_dispute_search1").keydown(searchUser);
	}
	this.ctor = ctor;
    function showPage(){
		global.globalHide()
		$(".global_page_mentor").show()
		
		getData()
	}
	this.showPage = showPage;
    
    var searchDisputeId = 0;
	function searchDispute(e){
            
        if (e.keyCode == 13) {
            searchDisputeId = $(this).val();
            if(searchDisputeId.length==0){
                searchDisputeId=0;
            }
            
            getData()
        }
    }
	
    var searchUserName = "";
    function searchUser(e){
        if (e.keyCode == 13) {
            searchUserName = $(this).val();
            
            getData()
        }
    }
	
    function showUsers(){
        location.href='/#mentorUsers';
        $(".mentor_disputeShow").hide()
        $(".mentor_open").removeClass("mentor_openActive");
        $(".mentor_openUsers").addClass("mentor_openActive");
        
        $(".mentor_table").hide()   
        $(".mentor_table1").show()
    }
    this.showUsers = showUsers;
    
    function showDispute(){
        location.href='/#mentor';
        $(".mentor_disputeShow").show()
        $(".mentor_open").removeClass("mentor_openActive");
        $(this).addClass("mentor_openActive");
        
        $(".mentor_table1").hide()   
        $(".mentor_table").show()
    }
    
	function getData(){
		var data = {
            searchDisputeId:searchDisputeId,
            searchUserName:encodeURIComponent(searchUserName)
        };
        
		var url = '/api/mentor/showAllDispute/';

		global.api(url,data,function(data){
			var json = JSON.parse(data);
			var usersCount = json[2][0].users;
            var disputeCount = json[3][0].disputes;

            $(".mentor_dataUsers span").text(usersCount)
            $(".mentor_dataDisputes span").text(disputeCount)
            
            echoDataDisputes(json[0]);
            echoDataDisputesStart(json[4]);
            echoDataUsers(json[1]);
		})
	}
	function echoDataDisputes(json){
		var loopLength = json.length;
			
		var clone = $(".mentor_table_rowDown:first").clone()
		$(".mentor_table_rowDown").remove()
		$(".mentor_table_rowDownHolder").append(clone);
		
		for(var i=0; i<loopLength ;i++){
			var clone = $(".mentor_table_rowDown:first").clone()
			var date = convertDate(json[i].date)
			var startDate = convertDate(json[i].startDate)
			
			clone.find(".mentor_table_rowDown_text_name").text(decodeURIComponent(json[i].title));
			clone.find(".mentor_table_rowDown_text_status").text("יתבצע בהמשך");
			clone.find(".mentor_table_rowDown_text_startTime").text(decodeURIComponent(date));
			clone.find(".mentor_table_rowDown_text_endTime").text(decodeURIComponent(startDate));
			clone.find(".mentor_table_rowDown_text_votes").text(decodeURIComponent(json[i].votes));
			clone.find(".mentor_table_rowDown_text_mediator").text(decodeURIComponent(json[i].mediator_name))
			clone.find(".mentor_table_rowDown_text_brainstorm").text(decodeURIComponent(json[i].brainstorms));
            clone.find(".mentor_table_rowDown_text_status").text(parseMainTagToString(json[i].tag1))
            
            if(json[i].isShow==1){
                clone.find(".mentor_table_rowDown_text_isShow").text('כן');
            }
            else{
                clone.find(".mentor_table_rowDown_text_isShow").text('לא');
                
            }
            
			clone.click({disputeId:json[i].id},enterDispute)
            
			$(".mentor_table_rowDownHolder").append(clone);
			clone.show()
		}
	}
	
    function echoDataDisputesStart(json){
		var loopLength = json.length;
			
		var clone = $(".mentor_table_rowDown2:first").clone()
		$(".mentor_table_rowDown2").remove()
		$(".mentor_table_rowDownHolder2").append(clone);
		
		for(var i=0; i<loopLength ;i++){
			var clone = $(".mentor_table_rowDown2:first").clone()
			var date = convertDate(json[i].date)
			var startDate = convertDate(json[i].startDate)
			
			clone.find(".mentor_table_rowDown_text_name").text(decodeURIComponent(json[i].title));
			clone.find(".mentor_table_rowDown_text_status").text(json[i].date.split('T')[0]);
			clone.find(".mentor_table_rowDown_text_startTime").text(decodeURIComponent(json[i].parties1_name));
			clone.find(".mentor_table_rowDown_text_endTime").text(json[i].pass);
			clone.find(".mentor_table_rowDown_text_delete").click({disputeId:json[i].id},deleteStartDispute)
            
			$(".mentor_table_rowDownHolder2").append(clone);
			clone.show()
		}
	}
    
    function deleteStartDispute(e){
        var disputeId = e.data.disputeId;
        
        if(confirm('האם אתה בטוח שאתה רוצה למחוק את הסכסוך?')){
            var data = {disputeId:disputeId}
            var url = '/api/mentor/deleteDisputeStart/'
            
            global.api(url,data,function(data){
                getData()
            })
        }
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
    
    function enterDispute(e) {
        var disputeId = e.data.disputeId;
        
        location.href= '/#mDispute?disputeId=' + disputeId;
    }
    
	function convertDate(date){
		var date = new Date(date);
		
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var secondes = date.getSeconds();
		
		var month = date.getMonth()+1;
		var day = date.getDate()
		var year = date.getFullYear()
		return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + secondes;
	}
    
    function echoDataUsers(json){
        var loopLength = json.length;
        
        var clone = $(".mentor_table_rowDown1:first").clone();
        $(".mentor_table_rowDown1").remove();
        $(".mentor_table_rowDownHolder1").append(clone);

        $(".mentor_table_rowDown_text5").unbind('click');

        for(var i=0; i<loopLength ;i++)
        {
            var clone = $(".mentor_table_rowDown1:first").clone();
            clone.find(".mentor_table_rowDown_text2").text(decodeURIComponent(json[i].firstName));
            clone.find(".mentor_table_rowDown_text3").text(decodeURIComponent(json[i].email));
            clone.find(".mentor_table_rowDown_text4").text(decodeURIComponent(json[i].points));
            clone.find(".mentor_table_rowDown_text6").text(parseLevel(json[i].level));
            clone.click({userId:json[i].id},goToUsers)
            if(json[i].block==1){
                clone.find(".mentor_table_rowDown_text5").text("חסום");
            }
            else{
                clone.find(".mentor_table_rowDown_text5").text("לא חסום");
            }
            
            // clone.find(".mentor_table_rowDown_text5").text(decodeURIComponent(json[i].firstName));
            clone.find(".mentor_table_rowDown_text5").click({id:json[i].id},blockOrNot);
            
            clone.show()
            
            $(".mentor_table_rowDownHolder1").append(clone);
        }
    }
    function goToUsers(e){
        var userId = e.data.userId;
        
        location.href='/#mUsers?userId=' + userId;
    }
    function parseLevel(level){
        var levelText = 'אין';
        
        if(level==1){
            levelText = 'פטיש שופטים';
        }
        else if(level==2){
            levelText = 'מאזני צדק';
        }
        else if (level==3){
            levelText = 'פאת שופטים';
        }
        return levelText;
    }
    
    function blockOrNot(e){
        var id = e.data.id;
        
        var data = {id:id};
        var url = '/api/mentor/blockUser/'
        
        global.api(url,data,function(data){
            
            getData();
        })
    }
}