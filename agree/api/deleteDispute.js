var deleteDispute = new deleteDisputeJs()
function deleteDisputeJs(){
	function ctor(){
		
		var url = req.originalUrl.split('/')[3];
		if(url == "deleteDis"){
			deleteDis(res,req,id);
		}
	}
	this.ctor = ctor;
	
	function deleteDis(res,req,id){
		var sql = "DELETE FROM disputeBrainstorm WHERE dispute_id=1; "
		+ "DELETE FROM disputeChat WHERE dispute_id=1; "
		+ "DELETE FROM disputeVotes WHERE dispute_id=1; "
		+ "DELETE FROM disputeMessages WHERE dispute_id=1; "
		+ "UPDATE dispute SET "
			+ "parties1_agree=0, "
			+ "parties1_feel=0, "
			+ "parties2_agree=0, "
			+ "parties2_feel=0 "
		+"WHERE id=1; ";
		console.log(sql)
		pool.query(sql,function(err,result){
			res.send(result);	
		})
	}
	this.deleteDis = deleteDis; 
}