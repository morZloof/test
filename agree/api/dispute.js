var dispute = new disputeJs();
function disputeJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "insertMessage"){
			insertMessage(res,req,id);
		}
		else if(url == "getDispute"){
			getDispute(res,req,id);
		}
		else if(url == "getAllDispute"){
			getAllDispute(res,req,id);
		}
		else if(url == "insertBrainstorm"){
			insertBrainstorm(res,req,id);
		}
		else if(url == "insertTag"){
			insertTag(res,req,id);
		}
		else if(url == "deleteTag"){
			deleteTag(res,req,id);
		}
		else if(url == "insertVote"){
			insertVote(res,req,id);
		}
		else if(url == "insertAgree"){
			insertAgree(res,req,id);
		}
		else if(url == "insertDecide"){
			insertDecide(res,req,id);
		}
		else if(url == "agreeDecide"){
			agreeDecide(res,req,id);
		}
		else if(url == "insertChatMessage"){
			insertChatMessage(res,req,id);
		}
		else if(url == "getChatMessage"){
			getChatMessage(res,req,id);
		}
		else if(url == "removeBrainstorm"){
			removeBrainstorm(res,req,id);
		}
		else if(url == "firstAgree"){
			firstAgree(res,req,id);
		}
        else if(url == "setTitle"){
			setTitle(res,req,id);
		}
        else if(url == 'setPartiesText'){
            setPartiesText(res,req,id);
        }
		else if(url == 'changeFill'){
			changeFill(res,req,id);
		}
		else if(url == 'changeFirstAgree'){
			changeFirstAgree(res,req,id);
		}
		else if(url == 'updateMediatorText'){
			updateMediatorText(res,req,id);
		}
		else{
			res.send(url);
		}
	}
	this.ctor = ctor;

	function updateMediatorText(res,req,id){
		var dispute_id = req.query.dispute_id;
		var text= req.query.text;

		var sql = 'UPDATE dispute SET '
			+ 'mediator_choiceText="' + text + '" '
			+ 'WHERE id=' + dispute_id

		pool.query(sql,function(err,result){
			res.send('success');
		})
	}

	function changeFirstAgree(res,req,id){
		var dispute_id = req.query.dispute_id;
		var mediator_textProblem = req.query.mediator_textProblem;
		var tag1 = req.query.tag1;
		var tag2 = req.query.tag2;
		var tag3 = req.query.tag3;
		var tag4 = req.query.tag4;

        var sql = 'SELECT * '
                + 'FROM dispute '
                + 'WHERE id=' + dispute_id + '; '
                
        pool.query(sql,function(err,result){
            
            var parties1_firstAgree = result[0].parties1_firstAgree;
            var parties2_firstAgree = result[0].parties2_firstAgree;
            
            var sql = 'UPDATE dispute SET '
                    + 'mediator_textProblem = "' + mediator_textProblem + '", ';
                    
            if(parties1_firstAgree!=2){
                sql += 'parties1_firstAgree=1, '
            }
            if(parties2_firstAgree!=2){
                sql += 'parties2_firstAgree=1, '
            }
                sql += 'tag1="' + tag1 + '", '
                    + 'tag2="' + tag2 + '", '
                    + 'tag3="' + tag3 + '", '
                    + 'tag4="' + tag4 + '", '
                    + 'blockStatus=1 '
                    //+ 'isShow=0 '
                    + 'WHERE id=' + dispute_id + '; '

                    + 'SELECT * '
                    + 'FROM dispute '
                    + 'WHERE id=' + dispute_id + '; '

            pool.query(sql,function(err,result){
                res.send(result);
            
                var parties1_id = result[1][0].parties1_id;
                var parties2_id = result[1][0].parties2_id;
            
                var sql =  'INSERT INTO notification '
                        + '(users_id,other,text_type,image_type,date) '
                        + 'VALUES '
                        + '(' + parties1_id + ',' + dispute_id + ',6,3,NOW()); '
            
                        + 'INSERT INTO notification '
                        + '(users_id,other,text_type,image_type,date) '
                        + 'VALUES '
                        + '(' + parties2_id + ',' + dispute_id + ',6,3,NOW()) '
            
                pool.query(sql);
            })
        })
        
	}

	//GET: feel, dispute_id
	function changeFill(res,req,id){
		var dispute_id = req.query.dispute_id;
		var fill = req.query.feel;

		var sql = 'SELECT * '
			+ 'FROM dispute '
			+ 'WHERE id=' + dispute_id;

		pool.query(sql,function(err,result){
			if(result[0].parties1_id == id){
				var sql = 'UPDATE dispute SET '
					+ 'parties1_feel= ' + fill + ' '
					+ 'WHERE id=' + dispute_id;

				pool.query(sql);
				res.send('success')
			}
			else if(result[0].parties2_id == id){
				var sql = 'UPDATE dispute SET '
					+ 'parties2_feel= ' + fill + ' '
					+ 'WHERE id=' + dispute_id;

				pool.query(sql);
				res.send('success')
			}
			else{
				res.send('-10');
			}
		})
	}

    //GET: dispute_id, text
    function setPartiesText(res,req,id){
		var text = req.query.text;
		var dispute_id = req.query.dispute_id;
        
        var sql = 'SELECT * '
                + 'FROM dispute '
                + 'WHERE id=' + dispute_id + '; '
                
                + 'SELECT * '
                + 'FROM users '
                + 'WHERE id=' + id + '; '
                
        pool.query(sql,function(err,result){
    		var parties1_id = result[0][0].parties1_id;
			var parties1_name = result[0][0].parties1_name;
    		var parties2_id = result[0][0].parties2_id;
			var parties2_name = result[0][0].parties2_name;
			var mediator_id = result[0][0].mediator_id;
            var title = result[0][0].title;
            var userName = result[1][0].firstName;
            
            if(id==parties1_id){
                var sql = 'UPDATE dispute SET '
                            + 'parties1_textProblem="' + text + '", '
                            + 'parties1_firstAgree=2 '
                        + 'WHERE id=' + dispute_id + ' AND parties1_id=' + id + '; '

						+ 'INSERT INTO notification '
						+ '(users_id,title,other,other_name,text_type,image_type,date) '
						+ 'VALUES '
						+ '(' + mediator_id + ',"' + title + '",' + dispute_id + ',"' + parties1_name + '",3,1,NOW()); '

				res.send('success');
            }
            else if(id==parties2_id){
                var sql = 'UPDATE dispute SET '
                            + 'parties2_textProblem="' + text + '", '
                            + 'parties2_firstAgree=2 '
                        + 'WHERE id=' + dispute_id + ' AND parties2_id=' + id + '; '

						+ 'INSERT INTO notification '
						+ '(users_id,title,other,other_name,text_type,image_type,date) '
							+ 'VALUES '
						+ '(' + mediator_id + ',"' + title + '",' + dispute_id + ',"' + parties2_name + '",3,1,NOW()) '

				res.send('success');
            }
            else{
                res.send('error');
            }
            
            pool.query(sql);
        })
    }
    
    //GET: dispute_id, title
    //error: you are not the mentor
    function setTitle(res,req,id){
		var dispute_id = req.query.dispute_id;
		var title = req.query.title;
        
        var sql = 'SELECT * '
                + 'FROM dispute '
                + 'WHERE id=' + dispute_id;
        
        pool.query(sql,function(err,result){
			var dispute_id = result[0].id;
            var mediator_id = result[0].mediator_id;
			var parties1_id = result[0].parties1_id;
			var parties2_id = result[0].parties2_id;

            if(mediator_id==id){
                var sql = 'UPDATE dispute SET '
                            + 'title = "' + title + '" '
                        + 'WHERE id=' + dispute_id + '; '

						+ 'INSERT INTO notification '
							+ '(users_id,other,text_type,image_type,date) '
						+ 'VALUES '
							+ '(' + parties1_id + ',' + dispute_id + ',2,3,NOW()); '

						+ 'INSERT INTO notification '
							+ '(users_id,other,text_type,image_type,date) '
						+ 'VALUES '
							+ '(' + parties2_id + ',' + dispute_id + ',2,3,NOW()) '
                pool.query(sql,function(err,result){
                    res.send('success');
                })
            }
            else{
                res.send('error: you are not the mentor');
            }
            // res.send(result);
        })
    }
    //GET: dispute_id
	function firstAgree(res,req,id){
		var dispute_id = req.query.dispute_id;
        
        var sql = 'SELECT * FROM dispute WHERE id=' + dispute_id + ';';
        
        pool.query(sql,function(err,result){
            //parties1_firstAgree
    		var parties1_id = result[0].parties1_id;
    		var parties2_id = result[0].parties2_id;
    		var mediator_id = result[0].mediator_id;
            //parties1_firstAgree
            if(id==parties1_id){
              var sql = 'UPDATE dispute SET '
                            + 'parties1_firstAgree=2 '
                        + 'WHERE id=' + dispute_id + ' AND parties1_id=' + id;  
                res.send('success');
            }
            else if(id==parties2_id){
                var sql = 'UPDATE dispute SET '
                            + 'parties2_firstAgree=2 '
                        + 'WHERE id=' + dispute_id + ' AND parties2_id=' + id;
                res.send('success');
            }
            else if(id==mediator_id){
                var sql = 'UPDATE dispute SET '
                            + 'mediator_firstAgree=1 '
                        + 'WHERE id=' + dispute_id + ' AND mediator_id=' + id;
                res.send('success');
            }
            else{
                res.send('-10');
            }
            pool.query(sql);
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
	
	function getAllDispute(res,req,id){
		
		var sql = 'SELECT * FROM '
						+ 'dispute '
					+ 'WHERE id IN'
						+ '(SELECT id from '
							+ 'disputeFav '
						+'WHERE id =' + id + '); '
				+ 'SELECT * FROM '
						+ 'dispute '
					+ 'WHERE id NOT IN'
						+ '(SELECT id from '
							+ 'disputeFav '
						+ 'WHERE id =' + id + '); '
					+ 'LIMIT 20';
					
		pool.query(sql,function(err,result){
			res.send(result)	
		})					
	}
	this.getAllDispute = getAllDispute;
	//get: send_id, id_dispute, text, date
	function insertChatMessage(res,req,id){
		var send_id = req.query.send_id;
		var id_dispute = req.query.id_dispute;
		var text = req.query.text;
		
		var date = formatDate(new Date());
		var sql = 'SELECT * FROM dispute where id=' + id_dispute + '; '
                
                + 'SELECT firstName,id '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties1_id '
                    + 'FROM dispute '
                    + 'WHERE id=' + id_dispute + '); '
                    
                + 'SELECT firstName,id '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties2_id '
                    + 'FROM dispute '
                    + 'WHERE id=' + id_dispute + '); '

		pool.query(sql,function(err,result){
			var mediator_id = result[0][0].mediator_id;
            var title = result[0][0].title;
            var id1 = result[1][0].id
            var userName1 = result[0][0].parties1_name;
            var id2 = result[2][0].id
            var userName2 = result[0][0].parties2_name;
            
			if(send_id==0){
				var sql = 'INSERT disputeChat '
                        + '(dispute_id,mentor_id,users_id,mentorToUser,text,date) '
                            + 'VALUES '
                        + '(' + id_dispute + ',' + mediator_id + ',' + id + ',false,"' + text + '","' + date + '"); '
                        
                        if(id==id1){
                            var userName = userName1;
                        }
                        else{
                            var userName = userName2;
                        }
                        
                        sql += 'DELETE FROM notification '
                              + 'WHERE users_id=' + mediator_id + ' AND other=' + id_dispute + ' AND other_name="' + userName + '" AND text_type=15; '
                        
                            + 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mediator_id + ',' + id_dispute + ',"' + userName + '","' + userName2 + '",15,1,"' + title + '",now()); '

				pool.query(sql,function(err,result){
					getChatMessage(res,req,id);
				}) 
			}
			else{
				var sql = 'INSERT disputeChat (dispute_id,mentor_id,users_id,mentorToUser,text,date) VALUES (' + id_dispute + ',' + send_id + ',' + id + ',true,"'+ text + '","' + date + '");';
				pool.query(sql,function(err,result){
					getChatMessage(res,req,id);
				})
			}
		})
	}
	
	//get: id_dispute
	function getChatMessage(res,req,id){
		var id_dispute = req.query.id_dispute;
		
		var sql = 'SELECT * FROM disputeChat WHERE dispute_id=' + id_dispute + ' AND (mentor_id=' + id + ' OR users_id=' + id + ') ORDER BY date DESC;';
		
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
	// get: id_disputeBrainstorm
	function insertAgree(res,req,id){
		var id_disputeBrainstorm = req.query.id_disputeBrainstorm;
		
        var sql = 'SELECT * '
                + 'FROM users '
                + 'WHERE id=' + id + '; '
        
        pool.query(sql,function(err,result){
            var isMentor = (result[0].mentor);
        
            var sql = 'INSERT INTO notification '
                        + '(users_id,other,text_type,image_type,points,title,date) '
                    + 'VALUES '
                        + '((SELECT users_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + ')'
                        + ',(SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + ')'
                        + ',103,2,35,'
                        + '(SELECT title FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + '),now()); '
                    
                    + 'UPDATE users SET '
                        + 'points=points+35 '
                    + 'WHERE id IN (SELECT users_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + '); '
                    
                    if(isMentor==1){
                        + 'UPDATE disputeBrainstorm '
                            + 'SET place=2 '
                        + 'WHERE id=' + id_disputeBrainstorm + '; '
                    }
                    else{
                        + 'UPDATE disputeBrainstorm '
                            + 'SET place=2, '
                            + 'usersMove_id=' + id + ' '
                        + 'WHERE id=' + id_disputeBrainstorm + '; '
                    }
            pool.query(sql)
            res.send('success');
        })
	}
	
	// get: id_disputeBrainstorm
	function insertDecide(res,req,id){
		var id_disputeBrainstorm = req.query.id_disputeBrainstorm;

		var sql = 'UPDATE dispute SET '
				+ 'blockVotesBrain=1 '
				+ 'WHERE id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm +'); '
                
                + 'SELECT * '
                + 'FROM dispute '
                + 'WHERE id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' +  id_disputeBrainstorm + '); '
                
                + 'SELECT * '
                + 'FROM disputeBrainstorm '
                + 'WHERE id=' + id_disputeBrainstorm + '; '
                
                + 'SELECT count(*) AS brainCounter '
                + 'FROM disputeBrainstorm '
                + 'WHERE dispute_id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + ') AND place=1 AND usersMove_id<>' + id + '; '
                
                + 'SELECT mediator_id '
                + 'FROM dispute '
                + 'WHERE id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + '); '
                
                + 'SELECT firstName,id '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties1_id '
                    + 'FROM dispute '
                    + 'WHERE id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + ')); '
                
                + 'SELECT firstName,id '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties2_id '
                    + 'FROM dispute '
                    + 'WHERE id IN (SELECT dispute_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + ')); '

        pool.query(sql,function(err,result){
            var title = result[1][0].title;
            var dispute_id = result[1][0].id;
            var users_id = result[2][0].users_id;
            var ifTwoAgree = result[2][0].usersMove_id;
            var vstatus = result[1][0].vstatus;
            var agreeBarinCounter = result[3][0].brainCounter;
            var mentor_id = result[4][0].mediator_id;
            var userName1 = result[1][0].parties1_name;
            var id1 = result[5][0].id;
            var userName2 = result[1][0].parties2_name;
            var id2 = result[6][0].id;

            if(ifTwoAgree==null){
                console.log(userName1)
                var sql = 'UPDATE disputeBrainstorm '
				            + 'SET place=1, '
				            + 'usersMove_id=' + id + ' '
				        + 'WHERE id=' + id_disputeBrainstorm + '; '
                 
                    + 'INSERT INTO notification '
                        + '(users_id,other,text_type,image_type,points,title,date) '
                    + 'VALUES '
                        + '(' + users_id + ',' + dispute_id + ',101,2,20,"' + title + '",now()); '
                    
                    + 'UPDATE users SET '
                        + 'points=points+20 '
                    + 'WHERE id IN (SELECT users_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + '); '
                    
                    if(agreeBarinCounter==0){
                        if(id2==id){
                            var userName3 = userName1;
                            userName1 = userName2;
                            userName2 = userName3;
                        }
                        
                        sql += 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mentor_id + ',' + dispute_id + ',"' + userName1 + '","' + userName2 + '",10,1,"' + title + '",now()); '
                    }
                    else{
                        sql += 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mentor_id + ',' + dispute_id + ',"' + userName1 + '","' + userName2 + '",11,1,"' + title + '",now()); '
                    }
            }
            else{
                var sql = 'UPDATE disputeBrainstorm '
				            + 'SET place=1, '
				            + 'usersMove1_id=' + id + ' '
				        + 'WHERE id=' + id_disputeBrainstorm + '; '
                
                    + 'INSERT INTO notification '
                        + '(users_id,other,text_type,image_type,points,title,date) '
                    + 'VALUES '
                        + '(' + users_id + ',' + dispute_id + ',102,2,50,"' + title + '",now()); '
                    
                    + 'UPDATE users SET '
                        + 'points=points+50 '
                    + 'WHERE id IN (SELECT users_id FROM disputeBrainstorm WHERE id=' + id_disputeBrainstorm + '); '
                    
                    + 'INSERT INTO notification '
                        + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                    + 'VALUES '
                        + '(' + mentor_id + ',' + dispute_id + ',"' + userName1 + '","' + userName2 + '",12,1,"' + title + '",now()); '
            }
            
            if(vstatus<2){
                sql += 'UPDATE dispute SET '
                            + 'vstatus=2 '
                        + 'WHERE id=' + dispute_id + '; '
            }
            
            pool.query(sql);
        })
		
		res.send('success');
	}
	
	// get: id_disputeBrainstorm
	function removeBrainstorm(res,req,id){
		var id_disputeBrainstorm = req.query.id_disputeBrainstorm;
		
		var sql = 'UPDATE disputeBrainstorm SET place=0,usersMove_id=' + id + ' WHERE id=' + id_disputeBrainstorm + ';';
		pool.query(sql);

		res.send('success');
	}
	
	// get: id_disputeBrainstorm, id_dispute
	// error: you allready vote for this
	function insertVote(res,req,id){
		var id_dispute = req.query.id_dispute;
		var id_disputeBrainstorm = req.query.id_disputeBrainstorm;
		
		async.waterfall([
			function(callback){
				var sql = 'SELECT count(*) AS counterVotes FROM disputeVotes WHERE disputeBrainstorm_id=' + id_disputeBrainstorm + ' AND users_id=' + id + ';';

				pool.query(sql,function(err,result){
					if(result[0]['counterVotes']==0){
						callback(null);	
					}
					else{
						res.send('error: you all ready vote for this');
					}
				})
			},function(callback){
				var sql = 'INSERT INTO disputeVotes (users_id,disputeBrainstorm_id,dispute_id) VALUES (' + id + ',' + id_disputeBrainstorm + ',' + id_dispute + ');'+
				'UPDATE disputeBrainstorm SET votes = votes+1 WHERE id=' + id_disputeBrainstorm + '; ' + 
				'UPDATE dispute SET votes = (SELECT sum(votes) FROM disputeBrainstorm WHERE dispute_id=' + id_dispute + ') WHERE id = ' +  id_dispute + '; ' +
                'SELECT * from dispute WHERE id=' + id_dispute + '; '

				pool.query(sql,function(err,result){
                    var sql = 'SELECT COUNT(*) AS counter '
                            + 'FROM disputeVotes '
                            + 'WHERE users_id=' + id + '; '
                    
                    var disputeTitle = result[3][0].title;
                   
                    pool.query(sql,function(err,result){
                        var counterVotes = (result[0].counter);
                        if(counterVotes==5){
                            var sql = 'UPDATE users SET '
                                        + 'points=points+6 '
                                    + 'WHERE id=' + id + '; '
                                    
                                sql += 'INSERT INTO notification '
                                        + '(users_id,other,text_type,image_type,points,title,date) '
                                    + 'VALUES '
                                        + '(' + id + ',' + id_dispute + ',105,2,5,'
                                        + '(SELECT title FROM dispute WHERE id=' + id_dispute + '),now()); '
                        }
                        else{
                             var sql = 'UPDATE users SET '
                                        + 'points=points+1 '
                                     + 'WHERE id=' + id + '; '
                        }
                        
                        if(counterVotes==1){
                            sql += 'INSERT INTO notification '
                                   + '(users_id,other,text_type,image_type,points,title,date) '
                                 + 'VALUES '
                                    + '(' + id + ',' + id_dispute + ',100,2,1,"' + disputeTitle + '",now())'
                        }
                        pool.query(sql);
                    })
                });
				res.send("success");
			}
		])
	}
	
	// get: id_dispute,text
	function deleteTag(res,req,id){
		var id_dispute = req.query.id_dispute;
		var tagNumber = req.query.tagNumber;
		
		if(tagNumber==1){
			var sql = 'UPDATE dispute SET tag1=null WHERE id=' + id_dispute + ';';
			
			res.send("success");
			pool.query(sql);
		}
		else if(tagNumber==2){
			var sql = 'UPDATE dispute SET tag2=null WHERE id=' + id_dispute + ';';
			
			res.send("success");
			pool.query(sql);
		}
		else if(tagNumber==3){
			var sql = 'UPDATE dispute SET tag3=null WHERE id=' + id_dispute + ';';
			
			res.send("success");
			pool.query(sql);
		}
		else{
			res.send("-10");
		}
	}
	
	// get: id_dispute,text
	// error: you need to delete first one of the tree tags
	function insertTag(res,req,id){
		var id_dispute = req.query.id_dispute;
		var text = req.query.text;
		
		var sql = 'SELECT * FROM dispute WHERE id=' + id_dispute + ';';
		
		pool.query(sql,function(err,result){
			var tag1 = result[0]['tag1'];
			var tag2 = result[0]['tag2'];
			var tag3 = result[0]['tag3'];
			
			if(tag1 == null){
				var sql = 'UPDATE dispute SET tag1="' + text + '" WHERE id=' + id_dispute + ';';

				pool.query(sql);
				res.send('success');
			}
			else if(tag2 == null){
				var sql = 'UPDATE dispute SET tag2="' + text + '" WHERE id=' + id_dispute + ';';

				pool.query(sql);
				res.send('success');
			}
			else if(tag3 == null){
				var sql = 'UPDATE dispute SET tag3="' + text + '" WHERE id=' + id_dispute + ';';

				pool.query(sql);
				res.send('success');
			}
			else{
				res.send('error: you need to delete first one of the tree tags');
			}
		})
	}
	//get: id_dispute, title, text
	function insertBrainstorm(res,req,id){
        var id_dispute = req.query.id_dispute;
		var title = req.query.title;
		var text = req.query.text;
		var anonimi = req.query.anonimi;
        
        var sql = 'SELECT * '
                + 'FROM dispute '
                + 'WHERE id=' + id_dispute + '; '
                
                + 'SELECT count(*) AS counter '
                + 'FROM disputeBrainstorm '
                + 'WHERE dispute_id=' + id_dispute + '; '
                
                + 'SELECT firstName '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties1_id '
                    + 'FROM dispute '
                    + 'WHERE id=' + id_dispute + '); '
                
                + 'SELECT firstName '
                + 'FROM users '
                + 'WHERE id IN '
                    + '(SELECT parties2_id '
                    + 'FROM dispute '
                    + 'WHERE id=' + id_dispute + '); '
                    
        pool.query(sql,function(err,result){
            var vstatus = result[0][0].vstatus;
            var title1 = result[0][0].title;
            var mentor_id = result[0][0].mediator_id;
            var firstName1 = result[2][0].firstName;
            var firstName2 = result[3][0].firstName;
            
            var counterBrainstorm = result[1][0].counter;
            var sql = 'INSERT INTO disputeBrainstorm (dispute_id,users_id,title,text,anonimi) VALUES (' + id_dispute + ',' + id + ',"' + title + '","' + text + '",' + anonimi + '); ' 
            + 'UPDATE dispute SET brainstorms=(SELECT count(*) FROM disputeBrainstorm where dispute_id = ' + id_dispute +') WHERE id = ' + id_dispute + '; '
        
            + 'UPDATE users SET '
                + 'points=points+5 '
            + 'WHERE id=' + id + '; '
            
            + 'INSERT INTO notification '
                + '(users_id,other,text_type,image_type,points,title,date) '
            + 'VALUES '
                + '(' + id + ',' + id_dispute + ',104,2,5,'
                + '(SELECT title FROM dispute WHERE id=' + id_dispute + '),now()); '
            
            if(vstatus==0){
                sql += 'UPDATE dispute SET '
                            + 'vstatus=1 '
                        + 'WHERE id=' + id_dispute + '; '
            }
            
            console.log(counterBrainstorm)
            if(counterBrainstorm==0){
                sql += 'INSERT INTO notification '
                        + '(users_id,title,text_type,image_type,date) '
                    + 'VALUES '
                        + '(' + mentor_id + ',"' + title1 + '",7,1,NOW()); '
            }
            else if(counterBrainstorm==5){
                sql += 'INSERT INTO notification '
                        + '(users_id,other_name,other_name1,title,text_type,image_type,date) '
                    + 'VALUES '
                        + '(' + mentor_id + ',"' + firstName1 + '","' + firstName2 + '","' + title1 + '",8,1,NOW()); '
            }
            else if(counterBrainstorm==10){
                sql += 'INSERT INTO notification '
                        + '(users_id,other_name,other_name1,title,text_type,image_type,date) '
                    + 'VALUES '
                        + '(' + mentor_id + ',"' + firstName1 + '","' + firstName2 + '","' + title1 + '",9,1,NOW()); '
            }
            
            pool.query(sql,function(err, result){
            	var sql = 'SELECT * from disputeBrainstorm WHERE dispute_id=' + id_dispute + ';';
            	pool.query(sql,function(err,result){
            		res.send(result);
            	})
            })
        })
	}
	
	//get: id_dispute, text
	function insertMessage(res,req,id){
		var id_dispute = req.query.id_dispute;
		var text = req.query.text;
		var feeling = req.query.feeling;
		
		var date = formatDate(new Date());

		var sql = 'INSERT INTO disputeMessages(dispute_id,text,users_id,date,feeling) VALUE (' + id_dispute + ',"' + text + '",' + id + ',"' + date + '",' + feeling + ');'+
		'SELECT text,users_id AS userWrite,parties1_name,parties2_name,mediator_id,mediator_name,disputeMessages.date FROM disputeMessages '+
		'JOIN dispute ON dispute.id=disputeMessages.dispute_id '+
		'WHERE dispute_id=' + id_dispute + ' ORDER BY disputeMessages.id DESC LIMIT 30; '+
		'UPDATE dispute SET feeling=' + feeling + ' WHERE id=' + id_dispute + '';

		pool.query(sql,function(err,result){
			res.send(result[1]);
		});
		
		var sql = 'SELECT * FROM dispute WHERE id=' + id_dispute + ';';
		
		pool.query(sql,function(err,result){
			var parties1_id = (result[0].parties1_id);
			var parties2_id = (result[0].parties2_id);
			var mentor_id = result[0].mediator_id;
            var title = result[0].title;
            
			if(parties1_id == id){
				var sql = 'UPDATE dispute SET '
							+ 'parties1_feel=' + feeling + ' '
						+ 'where id=' + id_dispute + '; '
                        
                        + 'DELETE FROM notification '
                        + 'WHERE users_id=' + mentor_id + ' AND other=' + id_dispute + ' AND text_type=16; '
                        
                        + 'INSERT INTO notification '
                            + '(users_id,other,text_type,image_type,title,date) '
                        + 'VALUES '
                            + '(' + mentor_id + ',' + id_dispute + ',16,1,"' + title + '",now()); '
				pool.query(sql);
			}
			else if(parties2_id == id){
				var sql = 'UPDATE dispute SET '
							+ 'parties2_feel=' + feeling + ' '
						+ 'where id=' + id_dispute + '; '
                        
                        + 'DELETE FROM notification '
                        + 'WHERE users_id=' + mentor_id + ' AND other=' + id_dispute + ' AND text_type=16; '
                        
                        + 'INSERT INTO notification '
                            + '(users_id,other,text_type,image_type,title,date) '
                        + 'VALUES '
                            + '(' + mentor_id + ',' + id_dispute + ',16,1,"' + title + '",now()); '
                        
				pool.query(sql);
			}
		})
	}
	
	//get: dispute_id
	function getDispute(res,req,id){
		var dispute_id = req.query.dispute_id;

		var sql = 'SELECT * FROM dispute WHERE id=' + dispute_id + '; '+
		'SELECT text,users_id AS userWrite,parties1_name,parties2_name,mediator_id,mediator_name,disputeMessages.date,disputeMessages.feeling FROM disputeMessages '+
		'JOIN dispute ON dispute.id=disputeMessages.dispute_id ' + 
		'WHERE dispute_id=' + dispute_id + ' ORDER BY disputeMessages.id DESC LIMIT 30; ' +
		'SELECT '
		+'disputeBrainstorm.id as id, '
		+'disputeBrainstorm.anonimi as anonimi, '
		+'disputeBrainstorm.dispute_id as dispute_id, '
		+'disputeBrainstorm.users_id as users_id, '
		+'disputeBrainstorm.title as title, '
		+'disputeBrainstorm.text as text, '
		+'disputeBrainstorm.votes as votes, '
		+'disputeBrainstorm.place as place, '
		+'disputeBrainstorm.usersMove_id as usersMove_id, '
        +'disputeBrainstorm.usersMove1_id as usersMove1_id, '
		+'users.firstName as firstName, '
		+'users.lastName as lastName '
		+'from disputeBrainstorm '
		+ 'JOIN users ON users.id=disputeBrainstorm.users_id ' 
		+ 'WHERE disputeBrainstorm.dispute_id=' + dispute_id + ' ORDER BY disputeBrainstorm.votes DESC; '
		+ 'SELECT * FROM disputeVotes WHERE users_id=' + id + ' AND dispute_id=' + dispute_id + '; '
        + 'SELECT count(*) AS counter FROM disputeBrainstorm WHERE users_id=' + id + ' AND dispute_id=' + dispute_id +'; '
	    + 'SELECT * FROM users WHERE id in (SELECT parties1_id FROM dispute WHERE id=' + dispute_id +'); '
        + 'SELECT * FROM users WHERE id in (SELECT parties2_id FROM dispute WHERE id=' + dispute_id +'); '
        
          
		pool.query(sql,function(err,result){
			res.send(result);		
		})
	}
	
	function agreeDecide(res,req,id){
		var dispute_id = req.query.dispute_id;

		var sql = 'SELECT * '
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
                    
        async.waterfall([function(callback){
            pool.query(sql,function(err,result){

                var parties1_id = result[0][0].parties1_id;
                var parties2_id = result[0][0].parties2_id;
                var mentor_id = result[0][0].mediator_id;
                var title = result[0][0].title;
                var vstatus = result[0][0].vstatus;
                var userName1 = result[1][0].firstName;
                var userName2 = result[2][0].firstName;
            
                if(parties1_id == id){
                    var sql = 'UPDATE dispute SET '
                                + 'parties1_agree=1 '
                            + 'where id=' + dispute_id + ';';
                            
                    if(vstatus<3){
                        sql += 'UPDATE dispute SET '
                                    + 'vstatus=3 '
                                + 'WHERE id=' + dispute_id + '; '
                    }
                    
                    pool.query(sql,function(err,result){
                        callback(null,userName1,userName2,mentor_id,title)
                    });
                    
                }
                else if(parties2_id == id){
                    var sql = 'UPDATE dispute SET '
                                + 'parties2_agree=1 '
                            + 'where id=' + dispute_id + ';';
                            
                    if(vstatus<3){
                        sql += 'UPDATE dispute SET '
                                + 'vstatus=3 '
                            + 'WHERE id=' + dispute_id + '; '
                    }
                    
                    pool.query(sql,function(err,result){
                        callback(null,userName1,userName2,mentor_id,title)
                    });
                }
            })
        },function(userName1,userName2,mentor_id,title,callback){
            var sql = 'SELECT * '
                    + 'FROM dispute '
                    + 'WHERE id=' + dispute_id + '; '
                    
                    + 'SELECT users_id '
                    + 'FROM disputeBrainstorm '
                    + 'WHERE dispute_id IN '  
                    + '(SELECT id FROM dispute WHERE id=' + dispute_id + ' AND parties1_agree=1 AND parties2_agree=1) LIMIT 1; '
                    
            pool.query(sql,function(err,result){
                if(result.length>0){
                    var parties1_id = result[0][0].parties1_id;
                    var parties2_id = result[0][0].parties2_id;
                    var userName1 = result[0][0].parties1_name;
                    var userName2 = result[0][0].parties2_name;
                    var parties1_agree = result[0][0].parties1_agree;
                    var parties2_agree = result[0][0].parties2_agree;
                    var vstatus = result[0][0].vstatus;
                    
                    var sql = '';
                    if(result[1][0]!=undefined){
                        var users_id = result[1][0].users_id;
                        
                        sql += 'UPDATE users SET '
                            + 'points=points+50 '
                            + 'WHERE id=' + users_id + '; '
                    }
                    
                    if(parties1_agree==1 && parties2_agree==1 && vstatus<4){
                        sql += 'UPDATE dispute SET '
                                + 'vstatus=4 '
                            + 'WHERE id=' + dispute_id + '; '
                    }
                    
                    if(parties1_agree==1 && parties2_agree==1){
                        if(parties1_id==id){
                            var userName = userName1
                        }
                        else{
                            var userName = userName2
                        }
                        
                        sql += 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mentor_id + ',' + dispute_id + ',"' + userName + '","' + userName2 + '",14,1,"' + title + '",now()); '
                    }
                    else if(parties1_agree==1){
                        sql += 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mentor_id + ',' + dispute_id + ',"' + userName1 + '","' + userName2 + '",13,1,"' + title + '",now()); '
                    }
                    else if(parties2_agree==1){
                        sql += 'INSERT INTO notification '
                                + '(users_id,other,other_name,other_name1,text_type,image_type,title,date) '
                            + 'VALUES '
                                + '(' + mentor_id + ',' + dispute_id + ',"' + userName2 + '","' + userName2 + '",13,1,"' + title + '",now()); '
                    }
                    
                    pool.query(sql);
                }
            });
        }])
        
		res.send("success");
	}
}
