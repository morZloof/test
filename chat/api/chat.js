var chat = new chatJs()
function chatJs(){
    function ctor(res,req,id){
        
        var url = req.originalUrl.split('/')[3];

		if(url == "getChat"){
            getChat(res,req,id);
		}
		else if(url == "openChat"){
            openChat(res,req,id);
		}
        else if(url == "closeChat"){
            closeChat(res,req,id);
		}
        else if(url == "getChatContent"){
            getChatContent(res,req,id);
        }
		else{
            res.send('error in chat.js');
		}
    }
    this.ctor = ctor;
	   
    function getChatContent(res,req,id){
        var otherUsers_id = req.query.otherUsers_id;
        
        var sql = 'SELECT * '
                + 'FROM msg '
                + 'WHERE (sendId=' + id + ' AND otherUsers_id=' + otherUsers_id + ') OR (sendId=' + otherUsers_id + ' AND otherUsers_id=' + id + ');'
        
        pool.query(sql,function(err,result){
            console.log(result);
            res.send(result);
        })    
    }
    
    //error: chat is all ready open
    function openChat(res,req,id){

        var otherUsers_id = req.query.otherUsers_id;
        var otherUsers_name = req.query.otherUsers_name;
        
        async.waterfall([
            function(callback){
                /*var sql = 'SELECT count(*) AS chatTotleCuounter '
                        + 'FROM openChats '
                        + 'WHERE users_id=' + id + '; '
                        
                        + 'SELECT count(*) AS chatCuounter '
                        + 'FROM openChats '
                        + 'WHERE users_id=' + id + ' AND otherUsers_id=' + otherUsers_id + '; '
                        
                 pool.query(sql,function(err,result){
                     var chatTotleCuounter = result[0][0].chatTotleCuounter;
                     var chatCuounter = result[1][0].chatCuounter;
                     
                     if(chatTotleCuounter>11){ 
                         // if you have too many chats windows we will delete the oldest chat
                         var sql = 'SELECT id '
                                 + 'FROM openChats '
                                 + 'WHERE users_id=' + id + ' LIMIT 10,1; '
                                 
                         pool.query(sql,function(err,result){
                             var deleteFromId = result[0].id;
                             
                             var sql = 'DELETE FROM openChats '
                                     + 'WHERE id>' + deleteFromId + ' LIMIT 5;'
                                    
                             pool.query(sql);
                             callback(null)
                         });
                     }
                     else if(chatCuounter==0){
                         callback(null);
                     }
                     else{
                         res.send('error: chat is all ready open');
                     }
                 })*/
                callback(null)
            },function(callback){//open chat
                 var sql = 'DELETE FROM openChats '
                + 'WHERE users_id=' + id + ' LIMIT 5;'
                 
                + 'INSERT INTO openChats '
                    + '(users_id,otherUsers_id,otherUsers_name,openDate) '
                + 'VALUES '
                    + '(' + id + ',' + otherUsers_id + ',"' + otherUsers_name + '",NOW()); '
                
                console.log(sql);
                pool.query(sql);
                //getChat(res,req,id);
                res.send('success');
            }
        ]) 
       
    }   
    
    function closeChat(res,req,id){
        var otherUsers_id = req.query.otherUsers_id;
        
        var sql = 'DELETE FROM openChats '
                + 'WHERE users_id=' + id + ' AND otherUsers_id=' + otherUsers_id + ';';
	   
        res.send('success');         
        pool.query(sql)
    }
    
    function getChat(res,req,id){
        var sql = 'SELECT * '
                + 'FROM openChats ' 
                + 'WHERE users_id=' + id + ' LIMIT 10; '
        
        pool.query(sql,function(err,result){
            res.send(result);
        })
    }
}