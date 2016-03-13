var allDispute = new allDisputeJs();
function allDisputeJs(){
            
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];
        
		if(url == "getAllDispute"){
			getAllDispute(res,req,id);
		}
		else if(url == "getAllDisputeFav"){
			getAllDisputeFav(res,req,id);
		}
		else if(url == "getAllDisputeVotes"){
			getAllDisputeVotes(res,req,id);
		}
		else if(url == "getAllDisputeBrainstorm"){
			getAllDisputeBrainstorm(res,req,id);
		}
		else if(url == "doFavorite"){
			doFavorite(res,req,id);
		}
		else if(url == "unDoFavorite"){
			unDoFavorite(res,req,id);
		}
		else if(url == "getFav"){
			getFav(res,req,id);
		}
		else if(url == "getTag"){
			getTag(res,req,id);
		}
        else if(url == "getAllDisputeHot"){
            getAllDisputeHot(res,req,id);
        }
		else{
			res.send("error allDisoute.js");
		}
	}
	this.ctor = ctor;
	
    function getAllDisputeHot(res,req,id){
        var tag_id = req.query.tag_id;
		
		var sql = 'SELECT * FROM dispute WHERE isShow=1 ORDER BY vstatus LIMIT 100;'
		
		pool.query(sql,function(err,result){
			res.send(result);
		})
    }
    this.getAllDisputeHot = getAllDisputeHot;
    
	//get: tag_id
	function getTag(res,req,id){
		var tag_id = req.query.tag_id;
		
		var sql = 'SELECT * FROM dispute where tag1=' + tag_id + ' AND isShow=1 LIMIT 100;'
		
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	this.getTag = getTag;
    
	function getFav(res,req,id){
		var sql = "SELECT * FROM disputeFav WHERE users_id=" + id;

		pool.query(sql,function(err,result){
			//console.log(sql)
			res.send(result);
		})
	}
	this.getFav = getFav;
	
	function unDoFavorite(res,req,id){
		var dispute_id = req.query.dispute_id;
		
		var sql = 'DELETE FROM disputeFav WHERE dispute_id=' + dispute_id + ' AND users_id=' + id + '; ';
					
		pool.query(sql,function(err,result){
			res.send("success");
		}) 
	}
	
	function doFavorite(res,req,id){
		var dispute_id = req.query.dispute_id;

		var sql = 'DELETE FROM disputeFav WHERE dispute_id=' + dispute_id + ' AND users_id=' + id + '; '
					+ 'INSERT INTO disputeFav '
					+ '(dispute_id,users_id) '
						+ 'VALUES '
					+ '(' + dispute_id + ',' + id + ');'

		pool.query(sql,function(err,result){
			res.send("success");
		}) 
	}
	
	function getAllDisputeVotes(res,req,id){
		var sql = 'SELECT * FROM dispute WHERE isShow=1 ORDER BY votes DESC LIMIT 50;'
		
		pool.query(sql,function(err,result){
			res.send(result)
		})
	}
    this.getAllDisputeVotes = getAllDisputeVotes;
    
	function getAllDisputeBrainstorm(res,req,id){
		var sql = 'SELECT * FROM dispute WHERE isShow=1 ORDER BY brainstorms DESC LIMIT 50;'

		pool.query(sql,function(err,result){
			res.send(result)
		})
	}
    this.getAllDisputeBrainstorm = getAllDisputeBrainstorm;
    
	function getAllDispute(res,req,id){
		var sql = 'SELECT * FROM dispute WHERE isShow=1 ORDER BY startDate DESC LIMIT 50;'
		
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	this.getAllDispute = getAllDispute;
	
	function getAllDisputeFav(res,req,id){
		
		var sql = 'SELECT * FROM '
                    + 'dispute '
                + 'WHERE id IN'
                    + '(SELECT dispute_id from '
                        + 'disputeFav '
                    +'WHERE users_id =' + id + ') '
                +'ORDER BY startDate DESC '
                + 'LIMIT 20; '

				+ 'SELECT * FROM '
                    + 'dispute '
                + 'WHERE id NOT IN'
                    + '(SELECT dispute_id from '
                        + 'disputeFav '
                    + 'WHERE users_id =' + id + ') AND isShow=1 '
                + 'ORDER BY startDate DESC '
                + 'LIMIT 20;'
		
		pool.query(sql,function(err,result){
			res.send(result)	
		})					
	}
}