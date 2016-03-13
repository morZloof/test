var mDispute = new mDisputeJs()
function mDisputeJs(){
	function ctor(){
        $(".mDispute_delete").click(deleteDispute);
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide()
		$(".global_page_mDispute").show()
		
		getData()
	}
	this.showPage = showPage;
    
    function deleteDispute(){
        if(confirm('האם אתה בטוח שאתה רוצה למחוק את הסכסוך')){
            var data = {dispute_id: dispute_id()};
            var url = '/api/mentor/deleteDispute/';
            
            global.api(url, data, function(data) {
                location.href= '/';
            });
        }  
    }
    
    function dispute_id(){
        var query = String(window.location);
	    var disputeId = query.substring((query.indexOf('=') + 1));
	    return disputeId;
    }
    
    function getData(){
        var data = {dispute_id: dispute_id()};
		var url = '/api/mentor/getDispute/';
		
        global.api(url, data, function(data) {
            var json = JSON.parse(data);
            
            setBrainstorm(json[0]);
            
            setData(json[1][0],json[2][0],json[3][0])
		});
    }
	
    function setData(jsonDispute,jsonSide1,jsonSide2){
        var title = decodeURIComponent(jsonDispute.title);
        
        $(".mDispute_users_row1 span").text(decodeURIComponent(jsonDispute.parties1_name))
        $(".mDispute_users_row2 span").text(decodeURIComponent(jsonSide1.firstName))
        $(".mDispute_users_row3 span").text(decodeURIComponent(jsonSide1.email))
        
        $(".mDispute_users_row4 span").text(decodeURIComponent(jsonDispute.parties2_name))
        $(".mDispute_users_row5 span").text(decodeURIComponent(jsonSide2.firstName))
        $(".mDispute_users_row6 span").text(decodeURIComponent(jsonSide2.email))
        $(".mDispute_title span").text(title);            
    }
    
    function setBrainstorm(json){
        var loopLength = json.length

        var clone= $(".mDispute_brainstorm_box:first").clone()
        $(".mDispute_brainstorm_box").remove()
        $(".mDispute_brainstormHolder").append(clone);
        
        for(var i=0; i<loopLength ;i++)
        {
            var clone= $(".mDispute_brainstorm_box:first").clone()
            clone.find('.mDispute_brainstorm_box_text').text(decodeURIComponent(json[i].title))
            clone.find('.mDispute_brainstorm_box_likes span').text(json[i].votes)
            clone.find('.mDispute_brainstorm_delete').click({id:json[i].id},deleteBrainStorm);
            
            clone.show()
            $(".mDispute_brainstormHolder").append(clone);
        }
    }
    
    function deleteBrainStorm(e){
        var brainstormId= (e.data.id)
        
        var data = {brainstormId:brainstormId}
        var url = '/api/mentor/deleteBrainstorm/';
                
        if(confirm('האם אתה בטוח שאתה רוצה למחוק את ההצעה לסכסוך?')){
            global.api(url,data,function(data){
                getData()
            })    
        }
    }   
}