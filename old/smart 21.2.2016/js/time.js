var time = new timeJs()
function timeJs(){

	ctor();
	function ctor(){
		check()
		setInterval(check,2000);
	}

	function check(){
		var sql= 'UPDATE usersBuildings SET inBuild=0, isUpdate=0 WHERE id IN '
		+ '(SELECT usersBuildings_id FROM buildingsTime WHERE dateEnd<NOW()); '
		+ 'DELETE FROM buildingsTime WHERE dateEnd<NOW(); '
        + 'SELECT * FROM factoryReq WHERE endDate<NOW() AND comfirm=0; ';
		pool.query(sql,function(err,result){
			var json = result[2];
            if(json[2]!=undefined){
                var loopLength = json.length;

                for(var i=0; i<loopLength ;i++){
                    var reqId = (json[i].id);
                    war.comfirmReqAction(reqId);
                }
            }
		})
	}
}