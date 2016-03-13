var mentor = new mentorJs();
function mentorJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "firstEdit"){
			firstEdit(res,req,id);
		}
		else if(url == "updateNote"){
			updateNote(res,req,id);
		}
		else if(url == "showAllDispute"){
			showAllDispute(res,req,id);
		}
		else if(url == "updateTime"){
			updateTime(res,req,id);
		}
        else if(url == "blockUser"){
			blockUser(res,req,id);
		}
        else if(url == "getDispute"){
            getDispute(res,req,id);
        }
        else if(url == "deleteBrainstorm"){
            deleteBrainstorm(res,req,id);
        }
        else if(url == "deleteDispute"){
            deleteDispute(res,req,id);
        }
        else if(url == 'getUserById'){
            getUserById(res,req,id);
        }
        else if(url == 'deleteDisputeStart'){
            deleteDisputeStart(res,req,id);
        }
		else{
			res.send("error mentor.js");
		}
	}
	this.ctor = ctor;
	
    function deleteDisputeStart(res,req,id){
         var disputeId = req.query.disputeId;
        
        async.waterfall([
            function(callback){
                var sql = 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id=' + id + ';'
                
                pool.query(sql,function(err,result){
                    var ifMentor = result[0].mentor;
                    
                    if(ifMentor==1){
                        callback(null);
                    }
                    else{
                        res.send('-10');
                    }
                })    
            },function(callback){
                var sql = 'DELETE FROM disputeStart '
                        + 'WHERE id=' + disputeId + ' LIMIT 1; '
                        
                pool.query(sql,function(err,result){
                    res.send('success');
                })
            }
        ])
    }
    function getUserById(res,req,id) {
        var userId = req.query.userId;
        
        async.waterfall([
            function(callback){
                var sql = 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id=' + id + ';'
                
                pool.query(sql,function(err,result){
                    var ifMentor = result[0].mentor;
                    
                    if(ifMentor==1){
                        callback(null);
                    }
                    else{
                        res.send('-10');
                    }
                })    
            },function(callback){
                var sql = 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id=' + userId + ' LIMIT 1; '
                        
                        + 'SELECT * '
                        + 'FROM dispute '
                        + 'WHERE parties1_id=' + userId + ' OR parties2_id=' + userId + '; '
                                                
                        + 'SELECT count(*) AS counter '
                        + 'FROM disputeVotes '
                        + 'WHERE users_id=' + userId + '; '
                        
                        + 'SELECT count(*) AS counter '
                        + 'FROM disputeBrainstorm '
                        + 'WHERE users_id=' + userId + '; '

                pool.query(sql,function(err,result){
                    res.send(result);
                })
            }
        ])
    }
    
    function deleteDispute(res,req,id){
        var dispute_id = req.query.dispute_id;
        
        var sql = 'DELETE FROM dispute '
                + 'WHERE id=' + dispute_id + '; '
                
                + 'DELETE FROM disputeBrainstorm '
                + 'WHERE dispute_id=' + dispute_id + '; '
                
                + 'DELETE FROM disputeVotes '
                + 'WHERE dispute_id=' + dispute_id + '; '
                
        pool.query(sql,function(err,result){
            res.send('success');
        })
    }
    
    function deleteBrainstorm(res,req,id){
        var brainstormId = req.query.brainstormId;
        
        async.waterfall([
            function(callback){
                var sql = 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id=' + id + ';'
                
                pool.query(sql,function(err,result){
                    var ifMentor = result[0].mentor;
                    
                    if(ifMentor==1){
                        callback(null);
                    }
                    else{
                        res.send('-10');
                    }
                })    
            },function(callback){
                var sql = 'DELETE FROM disputeBrainstorm '
                        + 'WHERE id=' + brainstormId + ' LIMIT 1; ';
                        
                pool.query(sql,function(err,result){
                    res.send('success');
                })
            }
        ])
    }
    
    function getDispute(res,req,id){
        var dispute_id = req.query.dispute_id;
        async.waterfall([
            function(callback){
                var sql = 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id=' + id + ';'
                
                pool.query(sql,function(err,result){
                    var ifMentor = result[0].mentor;
                    
                    if(ifMentor==1){
                        callback(null);
                    }
                    else{
                        res.send('-10');
                    }
                })    
            },function(callback){
                var sql = 'SELECT * '
                        + 'FROM disputebrainstorm '
                        + 'WHERE dispute_id=' + dispute_id + '; '
                        
                        + 'SELECT * '
                        + 'FROM dispute '
                        + 'WHERE id=' + dispute_id + '; '
                        
                        + 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id IN '
                            + '(SELECT parties1_id '
                            + 'FROM dispute '
                            + 'WHERE id=' + dispute_id + '); '
                        
                        + 'SELECT * '
                        + 'FROM users '
                        + 'WHERE id IN '
                            + '(SELECT parties2_id '
                            + 'FROM dispute '
                            + 'WHERE id=' + dispute_id + '); '
                            
                pool.query(sql,function(err,result){
                    res.send(result);
                })
            }
        ])
    }
    
    function blockUser(res,req,id){
        var userId = req.query.id;
        var sql = 'SELECT * '
                + 'FROM users '
                + 'WHERE id=' + userId;
                
        pool.query(sql,function(err,result){
            var userBlock = result[0].block;
            
            if(userBlock==0){
                var sql = 'UPDATE users SET '
                        + 'block=1 '
                    + 'WHERE id=' + userId + '; '
            }
            else{
                var sql = 'UPDATE users SET '
                        + 'block=0 '
                    + 'WHERE id=' + userId + '; '
            }
  
            pool.query(sql,function(err,result){
                res.send('success')
            })
        })
    }
    
	function showAllDispute(res,req,id){
        var searchDisputeId = parseInt(req.query.searchDisputeId);
        var searchUserName = req.query.searchUserName;
        
		var sql = 'SELECT * '
				+ 'FROM dispute '
				+ 'WHERE mediator_id=' + id + ' '
                    
                if(searchDisputeId!=0){
                    sql+= 'AND id=' + searchDisputeId + ' '
                }
            sql += 'LIMIT 50; '

            sql+= 'SELECT * '
                + 'FROM users '
                + 'WHERE firstName LIKE "' + searchUserName + '%" '
                + 'ORDER BY id DESC '
                + 'LIMIT 100; '
                
                + 'SELECT count(*) AS users '
                + 'FROM users; '
                
                + 'SELECT count(*) AS disputes '
                + 'FROM dispute; '
                
                + 'SELECT * '
                + 'FROM disputeStart '
                + 'LIMIT 20;'

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

	function updateTime(res,req,id){
		var id_dispute = req.query.id_dispute
		var date = req.query.time;
		
		var sql = 'UPDATE dispute SET '
					+ 'date = "' + date + '" '
				+ 'WHERE id= ' + id_dispute;
				
		pool.query(sql,function(err,result){
			res.send(result)
		})			
		
		
	}
	function updateNote(res,req,id){
		
		var id_dispute = req.query.id_dispute
		var mediator_note1 = req.query.mediator_note1
		var mediator_note2 = req.query.mediator_note2
		
		var sql = 'UPDATE dispute SET '
					+ 'mediator_note1 = "' + mediator_note1 + '", '
					+ 'mediator_note2 = "' + mediator_note2 + '" '
				+ 'WHERE id = ' + id_dispute
		
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
	function firstEdit(res,req,id){
		var id_dispute = req.query.id_dispute; 
		var mediator_textProblem = encodeURIComponent(req.query.mediator_textProblem);
		var parties1_textProblem = encodeURIComponent(req.query.parties1_textProblem);
		var parties2_textProblem = encodeURIComponent(req.query.parties2_textProblem);
		var tag1 = req.query.tag1;
		var tag2 = req.query.tag2;
		var tag3 = req.query.tag3;
		var tag4 = req.query.tag4;
		
		var sql = 'UPDATE dispute SET '
					+ 'mediator_textProblem = "' + mediator_textProblem + '", '
					+ 'parties1_textProblem = "' + parties1_textProblem + '", '
					+ 'parties2_textProblem = "' + parties2_textProblem + '", '
					+ 'parties2_textProblem = "' + parties2_textProblem + '", '
					+ 'parties2_textProblem = "' + parties2_textProblem + '", '
					//+ 'parties1_firstAgree=1, '
					//+ 'parties2_firstAgree=1, '
					+ 'tag1 = ' + tag1 + ', '
					+ 'tag2 = "' + tag2 + '", '
					+ 'tag3 = "' + tag3 + '", '
					+ 'tag4 = "' + tag4 + '", '
					+ 'isShow=1 '
				+ 'WHERE id = ' +  id_dispute

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
}